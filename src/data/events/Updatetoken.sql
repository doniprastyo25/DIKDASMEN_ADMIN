-- DECLARE @tken VARCHAR
UPDATE ListSekolah
SET Token = @jwttoken
FROM ListSekolah
WHERE KodeSekolah = @kodesekolah
AND KodeAktivasi = @kodeaktivasi
