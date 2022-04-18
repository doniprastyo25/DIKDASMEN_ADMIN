UPDATE ListSekolah
SET NamaSekolah = @namasekolah
    ,KodeAktivasi = @kodeaktivasi
FROM ListSekolah
WHERE Id = @idsekolah