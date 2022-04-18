-- DECLARE @kode_sekolah NVARCHAR
-- DECLARE @kode_aktivasi NVARCHAR
SELECT id
      ,NamaSekolah
      ,KodeSekolah
      ,KodeAktivasi
      ,Token
FROM dbo.ListSekolah
WHERE KodeSekolah = @kodesekolah
AND KodeAktivasi = @kodeaktivasi