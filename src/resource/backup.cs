CREATE 
	DEFINER = 'root'@'localhost'
PROCEDURE `misa.gd2.nttue`.Proc_MaterialGroupFilter(
     IN p_PageSize INT,
    IN p_PageNumber INT,
    IN p_FilterQuery VARCHAR(255),
    IN p_SortQuery VARCHAR(255)
)
BEGIN
    SET @PageIndex = p_PageNumber;
    SET @PageSize = p_PageSize;

    CREATE TEMPORARY TABLE IF NOT EXISTS tbMaterialGroupOriginal (
        RowIndex INT,
        MaterialGroupId CHAR(36),
        MaterialGroupCode VARCHAR(20),
        MaterialGroupName VARCHAR(255),
        Description VARCHAR(255),
        CreatedBy VARCHAR(255),
        CreatedDate DATETIME,
        ModifiedBy VARCHAR(255),
        ModifiedDate DATETIME
    );

    SET @SortExpression = '';

    IF p_SortQuery IS NOT NULL AND p_SortQuery <> '' THEN
        SET @SortExpression = CONCAT('ORDER BY ', p_SortQuery);
    ELSE
        SET @SortExpression = 'ORDER BY CreatedDate DESC';
    END IF;

    SET @FilterCondition = '';

    IF p_FilterQuery IS NOT NULL AND p_FilterQuery <> '' THEN
        SET @FilterCondition = CONCAT(' AND ', p_FilterQuery);
    END IF;

    SET @Sql = CONCAT(
        'INSERT INTO tbMaterialGroupOriginal (',
        'RowIndex, MaterialGroupId, MaterialGroupCode, MaterialGroupName, ',
        'Description, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate',
        ') ',
        'SELECT ROW_NUMBER() OVER (', @SortExpression, ') AS RowIndex, ',
        't.MaterialGroupId, t.MaterialGroupCode, t.MaterialGroupName, ',
        't.Description, t.CreatedBy, t.CreatedDate, t.ModifiedBy, t.ModifiedDate ',
        'FROM MaterialGroup t ',
        'WHERE 1 = 1 ', @FilterCondition
    );


    PREPARE stmt FROM @Sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    IF @PageSize != 0 OR @PageIndex != 0 THEN
        SET @IndexEnd = @PageIndex * @PageSize;
        SET @IndexStart = @IndexEnd - @PageSize + 1;

        SELECT * FROM tbMaterialGroupOriginal mo WHERE mo.RowIndex BETWEEN @IndexStart AND @IndexEnd;
    ELSE
        SELECT * FROM tbMaterialGroupOriginal mo;
    END IF;

    SELECT COUNT(*) FROM tbMaterialGroupOriginal;

    DROP TEMPORARY TABLE IF EXISTS tbMaterialGroupOriginal;
END