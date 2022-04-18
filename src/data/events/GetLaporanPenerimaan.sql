SELECT sub
    ,kd
    ,kategori
    ,dess
    ,total
    ,totalRp
    ,appsekolah
FROM LaporanKeuangan
WHERE kategori = 1
AND appsekolah = @appsekolah