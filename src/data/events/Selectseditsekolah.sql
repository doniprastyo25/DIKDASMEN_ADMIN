SELECT [Id]
      ,[NamaSekolah]
      ,[KodeSekolah]
      ,[KodeAktivasi]
      ,[Token]
  FROM [SakumuAktivasi].[dbo].[ListSekolah]
  WHERE Id = @id