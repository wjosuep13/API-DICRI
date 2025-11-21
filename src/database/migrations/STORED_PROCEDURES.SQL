
CREATE PROCEDURE SP_GetloginInfo
    @UserId varchar(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.id, 
        r.id AS rol,
        u.password
    FROM "USER" u
    INNER JOIN Rol r ON r.id = u.id_rol
    WHERE u.user_name = @UserId;
END;
GO


CREATE PROCEDURE SP_CrearExpediente
    @nombre             VARCHAR(50),
    @descripcion        VARCHAR(200),
    @fecha_creacion     DATE,
    @id_usuario         INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO EXPEDIENTE (
            nombre, 
            descripcion, 
            fecha_creacion, 
            id_tecnico
        )
        VALUES (
            @nombre, 
            @descripcion, 
            @fecha_creacion, 
            @id_usuario
        );

        DECLARE @nuevoExpedienteId INT = SCOPE_IDENTITY();

        INSERT INTO HISTORIAL_EXPEDIENTE (
            id_usuario,
            id_estado,
            id_expediente
        )
        VALUES (
            @id_usuario,
            1,
            @nuevoExpedienteId
        );
        SELECT 
            e.no_expediente,
            e.nombre,
            e.descripcion,
            e.fecha_creacion,
            e.id_tecnico,
            he.id_estado,
            ee.descripcion_estado AS estado_actual,
            he.fecha_actualizacion
        FROM EXPEDIENTE e
        INNER JOIN HISTORIAL_EXPEDIENTE he ON he.id_expediente = e.no_expediente
        INNER JOIN ESTADO_EXPEDIENTE ee ON ee.id = he.id_estado
        WHERE e.no_expediente = @nuevoExpedienteId;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO


CREATE PROCEDURE sp_listar_expedientes
    @id_tecnico INT,
    @rol INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.no_expediente,
        e.nombre,
        e.descripcion,
        e.fecha_creacion,
        e.id_tecnico,
        he.id_estado AS estado_actual,
        ee.descripcion_estado
    FROM EXPEDIENTE e
    OUTER APPLY (
        SELECT TOP 1 
            h.id_estado,
            h.fecha_actualizacion
        FROM HISTORIAL_EXPEDIENTE h
        WHERE h.id_expediente = e.no_expediente
        ORDER BY 
            h.fecha_actualizacion DESC,  -- mismo día → pasa al siguiente criterio
            h.id DESC                    -- garantiza el último registro real
    ) he
    LEFT JOIN ESTADO_EXPEDIENTE ee
        ON ee.id = he.id_estado
    WHERE 
        (@rol = 2) OR (e.id_tecnico = @id_tecnico)
    ORDER BY 
        e.no_expediente;
END;
GO



CREATE PROCEDURE SP_CrearIndicio
    @Descripcion VARCHAR(100),
    @Color VARCHAR(20),
    @Tamanio VARCHAR(100),
    @Peso_Libras DECIMAL(10,2),
    @Ubicacion VARCHAR(100),
    @Id_Tecnico INT,
    @No_Expediente INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insertar un nuevo indicio
    INSERT INTO INDICIO (
        descripcion,
        color,
        tamanio,
        peso_libras,
        ubicacion,
        id_tecnico,
        no_expediente
    )
    VALUES (
        @Descripcion,
        @Color,
        @Tamanio,
        @Peso_Libras,
        @Ubicacion,
        @Id_Tecnico,
        @No_Expediente
    );

    SELECT SCOPE_IDENTITY() AS NuevoIdIndicio;
END;
go



CREATE PROCEDURE SP_GetExpedienteById
    @IdExpediente INT
AS
BEGIN
    SET NOCOUNT ON;

    ---------------------------------------------------------
    -- 1. EXPEDIENTE + DATOS DEL TÉCNICO CREADOR
    ---------------------------------------------------------
    SELECT 
        E.no_expediente,
        E.nombre,
        E.descripcion,
        E.fecha_creacion,
        E.id_tecnico,

        -- Datos del técnico creador
        T.nombre AS tecnico_nombre,
        T.apellido AS tecnico_apellido,
        T.no_telefono AS tecnico_telefono,

        -- Usuario del técnico
        U.user_name AS tecnico_user_name

    FROM EXPEDIENTE E
    INNER JOIN TECNICO T ON T.id = E.id_tecnico
    INNER JOIN "USER" U ON U.id = T.id_usuario
    WHERE E.no_expediente = @IdExpediente;


    ---------------------------------------------------------
    -- 2. HISTORIAL COMPLETO (INCLUYE DATOS DE USUARIO)
    ---------------------------------------------------------
    SELECT 
        HE.id,
        HE.id_usuario,
        HE.id_estado,
        EE.descripcion_estado,
        HE.fecha_actualizacion,
        HE.descripcion_cambio,

        -- Datos del usuario que generó el cambio
        U.user_name,
        T.nombre AS usuario_nombre,
        T.apellido AS usuario_apellido

    FROM HISTORIAL_EXPEDIENTE HE
    INNER JOIN ESTADO_EXPEDIENTE EE 
        ON HE.id_estado = EE.id
    INNER JOIN "USER" U 
        ON U.id = HE.id_usuario
    INNER JOIN TECNICO T
        ON T.id_usuario = U.id
    WHERE HE.id_expediente = @IdExpediente
    ORDER BY HE.fecha_actualizacion DESC;

END;
GO

CREATE PROCEDURE SP_ListarIndicios
    @no_expediente INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        descripcion,
        color,
        tamanio,
        peso_libras,
        ubicacion,
        id_tecnico,
        no_expediente
    FROM INDICIO
    WHERE no_expediente = @no_expediente
    ORDER BY id;
END;
go


CREATE PROCEDURE SP_CambiarEstadoExpediente
    @IdExpediente INT,
    @IdUsuario INT,
    @IdEstado INT,
    @DescripcionCambio VARCHAR(300) = NULL   -- opcional
AS
BEGIN
    SET NOCOUNT ON;

    ---------------------------------------------------------
    -- Validaciones
    ---------------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM EXPEDIENTE WHERE no_expediente = @IdExpediente)
    BEGIN
        RAISERROR ('El expediente no existe.', 16, 1);
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM "USER" WHERE id = @IdUsuario)
    BEGIN
        RAISERROR ('El usuario no existe.', 16, 1);
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM ESTADO_EXPEDIENTE WHERE id = @IdEstado)
    BEGIN
        RAISERROR ('El estado proporcionado no existe.', 16, 1);
        RETURN;
    END;


    ---------------------------------------------------------
    -- Registrar historial (realiza el cambio de estado)
    ---------------------------------------------------------
    INSERT INTO HISTORIAL_EXPEDIENTE (
        id_usuario,
        id_estado,
        id_expediente,
        fecha_actualizacion,
        descripcion_cambio
    )
    VALUES (
        @IdUsuario,
        @IdEstado,
        @IdExpediente,
        GETDATE(),
        @DescripcionCambio
    );

END;
GO


CREATE PROCEDURE SP_FiltrarHistorialEstados
    @FechaInicio DATE,
    @FechaFin DATE,
    @IdEstado INT = NULL   
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        H.id,
        H.id_expediente,
        E.nombre AS nombre_expediente,
        H.id_estado,
        EE.descripcion_estado,
        H.id_usuario,
        T.nombre AS usuario_nombre,
        T.apellido AS usuario_apellido,
        H.fecha_actualizacion,
        H.descripcion_cambio
    FROM HISTORIAL_EXPEDIENTE H
    INNER JOIN EXPEDIENTE E ON E.no_expediente = H.id_expediente
    INNER JOIN ESTADO_EXPEDIENTE EE ON EE.id = H.id_estado
    INNER JOIN [USER] U ON U.id = H.id_usuario
    INNER JOIN TECNICO T ON U.id=T.id
    WHERE 
        H.fecha_actualizacion BETWEEN @FechaInicio AND @FechaFin
        AND (@IdEstado IS NULL OR H.id_estado = @IdEstado)  
    ORDER BY 
        H.fecha_actualizacion DESC;
END;
GO




