SELECT id
      ,NamaSekolah
      ,KodeSekolah
      ,KodeAktivasi
      ,Token
  FROM dbo.ListSekolah

  WHERE Id=@id
  AND KodeSekolah=@kodesekolah
  AND KodeAktivasi=@kodeaktivasi
  AND Token=@token