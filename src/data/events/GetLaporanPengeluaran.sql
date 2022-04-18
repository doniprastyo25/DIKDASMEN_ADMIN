SELECT sub
    ,kd
    ,kategori
    ,dess
    ,total
    ,totalRp
    ,appsekolah
FROM LaporanKeuangan
WHERE kategori = 2
AND appsekolah = @appsekolah