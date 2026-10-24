# Aşama 6 – Fotoğraf çekme, yükleme ve galeri

## Ne yaptım
Fotoğrafların doğrudan veritabanında saklanmasının performans sorunları yaratacağı prensibinden hareketle, Supabase Storage üzerinde `plant-photos` adında bir bucket oluşturdum ve `photos` tablosunu RLS politikalarıyla yapılandırdım. `camera.tsx` ekranında çekilen fotoğrafları yüklemeden önce boyut küçültme (compression) işleminden geçirerek Storage'a kaydettim ve veritabanı eşleştirmesini sağladım. Son olarak `gallery.tsx` ekranında o bitkiye ait fotoğrafları tarih sırasına göre grid yapısında listeledim.

## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| `app/plant/[id]/camera.tsx` | Kamera arayüzünü açar, fotoğraf çeker ve optimizasyon uygular. | Çekim butonları, görüntü sıkıştırma kodları ve yükleme tetikleyicileri. |
| `app/plant/[id]/gallery.tsx` | İlgili bitkiye ait geçmiş fotoğrafları tarih sıralı olarak gösterir. | Grid görünüm bileşenleri ve Storage'dan URL çekme mantığı. |
| `src/api/photos.ts` | Fotoğrafların Storage'a yüklenmesi ve veritabanına kaydedilmesi süreçlerini yönetir. | `uploadPhoto()` ve `getPhotosByPlantId()` servis fonksiyonları. |

## Öğrendiğim 3 kavram (Ekim 2026 Proje Geliştirme Sürecinde)
1. **Storage vs. Database Ayrımı:** Büyük medya dosyalarının (fotoğraf, video) veritabanı yerine bulut depolama alanlarında (Storage) tutulup, veritabanında sadece dosya yolunun (`path`) saklanması gerektiği mimari prensip.
2. **Image Compression (Görüntü Sıkıştırma):** Mobil cihazlarda çekilen yüksek boyutlu fotoğrafların sunucu kotasını doldurmaması ve internet tüketimini azaltması için yükleme öncesi optimize edilmesi.
3. **Bucket & Storage Policies:** Supabase Storage alanlarında verilerin kimler tarafından okunabileceğini (`SELECT`) ve kimler tarafından yüklenebileceğini (`INSERT`) denetleyen güvenlik katmanı.

## Takıldığım hata ve çözümü
- **Hata:** Yüksek çözünürlüklü ham fotoğrafların doğrudan yüklenmeye çalışılması sonucunda ağ (network) gecikmeleri ve yükleme hatalarının yaşanması.
- **Çözüm:** Yükleme adımından önce görüntü işleme kütüphanesi yardımıyla fotoğraf boyutları küçültülerek optimize edildi ve bu sayede hızlı bir yükleme akışı sağlandı.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `const manipResult = await manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 0.7, format: SaveFormat.JPEG });`
- **Açıklamam:** Bu satır, ham fotoğrafın piksel boyutlarını küçültüp sıkıştırarak hem veri boyutunu düşürmemizi hem de sunucuya hızlı ve hatasız bir şekilde yükleme yapabilmemizi sağlar.