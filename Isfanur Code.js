// 1. Database & Collection
use sekolahDB;
db.createCollection("madrasahAliyah");

// 2. Create Document (tambah data siswa)
db.madrasahAliyah.insertOne({
  namaSiswa: "Ahmad Fauzi",
  kelas: "12 IPA",
  jurusan: "Ilmu Pengetahuan Alam",
  tahunMasuk: 2023,
  status: "Aktif"  // status bisa "Aktif", "Lulus", "Keluar"
});

// 3. Read Document (cari siswa kelas 12 IPA)
db.madrasahAliyah.find({ kelas: "12 IPA" }).pretty();

// 4. Update Document (ubah status siswa menjadi Lulus)
db.madrasahAliyah.updateOne(
  { namaSiswa: "Ahmad Fauzi" },
  { $set: { status: "Lulus" } }
);

// 5. Delete Document (hapus data siswa yang keluar)
db.madrasahAliyah.deleteOne({ namaSiswa: "Nama Siswa Yang Keluar" });

// 6. Comparison Query (cari siswa yang masuk setelah tahun 2021)
db.madrasahAliyah.find({
  tahunMasuk: { $gt: 2021 }
});

// 7. Logical Query (cari siswa kelas 12 IPA atau jurusan IPS)
db.madrasahAliyah.find({
  $or: [
    { kelas: "12 IPA" },
    { jurusan: "Ilmu Pengetahuan Sosial" }
  ]
});

// 8. Bulk Write (tambah 2 data siswa baru dan update status satu siswa)
db.madrasahAliyah.bulkWrite([
  { insertOne: { document: { namaSiswa: "Siti Nurhaliza", kelas: "11 IPS", jurusan: "Ilmu Pengetahuan Sosial", tahunMasuk: 2024, status: "Aktif" } } },
  { insertOne: { document: { namaSiswa: "Budi Santoso", kelas: "10 IPA", jurusan: "Ilmu Pengetahuan Alam", tahunMasuk: 2025, status: "Aktif" } } },
  { updateOne: {
      filter: { namaSiswa: "Siti Nurhaliza" },
      update: { $set: { status: "Keluar" } }
    }
  }
]);

// 9. Aggregation (jumlah siswa per jurusan)
db.madrasahAliyah.aggregate([
  {
    $group: {
      _id: "$jurusan",
      totalSiswa: { $sum: 1 }
    }
  }
]);

// 10. Schema Validation (validasi schema data siswa)
db.createCollection("validatedMadrasahAliyah", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["namaSiswa", "kelas", "jurusan", "tahunMasuk", "status"],
      properties: {
        namaSiswa: {
          bsonType: "string",
          description: "namaSiswa harus bertipe string dan wajib ada"
        },
        kelas: {
          bsonType: "string",
          description: "kelas harus bertipe string dan wajib ada"
        },
        jurusan: {
          bsonType: "string",
          description: "jurusan harus bertipe string dan wajib ada"
        },
        tahunMasuk: {
          bsonType: "int",
          description: "tahunMasuk harus bertipe integer dan wajib ada"
        },
        status: {
          enum: ["Aktif", "Lulus", "Keluar"],
          description: "status harus berupa salah satu dari: Aktif, Lulus, Keluar dan wajib ada"
        }
      }
    }
  }
});
