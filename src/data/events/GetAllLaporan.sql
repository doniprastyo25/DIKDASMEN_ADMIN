SELECT sub
        ,kd
        ,kategori
        ,dess
        ,total
        ,totalRp
        ,appsekolah
FROM LaporanKeuangan
WHERE appsekolah = @appsekolah