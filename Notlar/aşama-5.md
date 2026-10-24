# Aşama 5 – QR üretme ve okutma

## Ne yaptım
Bitki detay sayfasında her bitkiye özel bir QR kod üreterek ekranda gösterdim. `scan.tsx` ekranında `expo-camera` kullanarak kamera üzerinden QR kod okutma özelliğini entegre ettim ve okunan bitki kimliği (`id`) ile doğrudan ilgili bitkinin detay sayfasına yönlendirme sağladım. Kamera izin yönetimi ve geçersiz/hatalı QR kod okutulması durumlarına karşı hata kontrolleri ekledim.

## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| `app/plant/[id].tsx` | Bitki detaylarını gösterirken ilgili bitkiye ait QR kodu da ekranda sunar. | Bitki bilgileri ve QR kod üreteci bileşeni (`react-native-qrcode-svg`). |
| `app/(tabs)/scan.tsx` | Kamerayı açarak karekodları tarayan ve okunan veriyi işleyen ekrandır. | Kamera tarayıcı bileşeni, izin kontrolleri ve yönlendirme mantığı. |
| `src/api/plants.ts` | Belirli bir bitkinin ID'sine göre veritabanından detay bilgilerini çeker. | `getPlantById(id)` veritabanı sorgu fonksiyonu. |

## Öğrendiğim 3 kavram (Ekim 2026 Proje Geliştirme Sürecinde)
1. **QR Kod İçeriği (Payload) Mantığı:** QR kodun içine bitkinin tüm hassas bilgilerini gömmek yerine, sadece benzersiz kimliğini (`id`) koyarak güvenli ve hafif bir yönlendirme yapma prensibi.
2. **Kamera İzin Yönetimi (Permissions):** Mobil uygulamalarda donanım özelliklerine (kamera) erişebilmek için kullanıcıdan dinamik olarak izin isteme ve reddedilme durumlarını yönetme akışı.
3. **Dynamic Routing Parametre Kullanımı:** Okunan QR kod verisinden elde edilen ID değerini Expo Router'ın dinamik rota yapısına (`/plant/[id]`) parametre olarak vererek doğru sayfaya geçiş sağlama.

## Takıldığım hata ve çözümü
- **Hata:** Veritabanında olmayan veya yanlış formatta bir QR kod okutulduğunda uygulamanın çökmesi (`null` veya geçersiz ID hatası).
- **Çözüm:** `getPlantById()` fonksiyonuna gelen ID'nin geçerliliğini kontrol eden koşullar eklendi; var olmayan bir bitki tarandığında kullanıcıya uyarı mesajı gösterilerek hata engellendi.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `const { status, requestPermission } = useCameraPermissions();`
- **Açıklamam:** Bu satır, kullanıcının telefonunun kamerasını kullanabilmek için sistemden izin durumunu sorgulamamızı ve gerekirse ekrana izin isteği pop-up'ı çıkartmamızı sağlayan bir kancadır (hook).