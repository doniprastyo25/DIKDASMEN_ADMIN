SELECT Id
      ,NamaSekolah
      ,KodeSekolah
      ,KodeAktivasi
      ,Token
  FROM dbo.ListSekolah

  WHERE Id=@id
  OR KodeSekolah=@kodesekolah
  OR KodeAktivasi=@kodeaktivasi