# Aşama 2 – Ekranlar ve navigasyon

## Ne yaptım
Expo Router'ın dosya tabanlı yönlendirme (file-based routing) mimarisini kullanarak uygulamanın tüm ekran iskeletini ve sayfa geçiş yollarını kurdum. Parantezli grup klasörleri ve dinamik rotalar yardımıyla kimlik doğrulama, sekmeli ana menü, bitki detay ve kamera/galeri alt kırılımlarını organize ettim.

## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| `app/(auth)/login.tsx` | Kullanıcı giriş ve kimlik doğrulama arayüzünü sağlar. | Giriş formu, e-posta/şifre alanları ve butonlar. |
| `app/(tabs)/_layout.tsx` | Alt sekmeli (tabs) navigasyon çubuğunu yapılandırır. | Tab bar tasarımı, ikonlar ve sekmeler arası yönlendirme ayarları. |
| `app/(tabs)/home.tsx` | Giriş yapıldıktan sonra ana akışın ve listelerin görüldüğü ekrandır. | Ana sayfa arayüz bileşenleri ve başlık. |
| `app/(tabs)/scan.tsx` | QR kod okutma işlemlerinin yapılacağı ekran arayüzüdür. | Kamera görünümü ve tarama alanı bileşenleri. |
| `app/(tabs)/profile.tsx` | Kullanıcı hesap bilgilerinin ve ayarların yer aldığı ekrandır. | Profil detayları ve çıkış yapma seçenekleri. |
| `app/plant/[id].tsx` | Seçilen spesifik bir bitkinin detay bilgilerini gösteren dinamik ekrandır. | Bitki detayları, sahte id gösterimi ve QR kod alanı. |
| `app/plant/[id]/camera.tsx` | Belirli bir bitkiye ait fotoğraf çekme işlemlerini yöneten ekrandır. | Kamera entegrasyonu ve çekim arayüzü. |
| `app/plant/[id]/gallery.tsx` | O bitkiye ait geçmiş fotoğrafların listelendiği galeri ekranıdır. | Fotoğraf grid görünümü ve tarih sıralaması. |
| `app/add-plant.tsx` | Sisteme yeni bir bitki kaydetmek için kullanılan form ekranıdır. | Bitki ekleme formu ve input alanları. |

## Öğrendiğim 3 kavram 
1.**Nested Layouts (İç İçe Layout Yapısı - `_layout.tsx`):** Üst düzey şablonların alt ekranları sarmalayarak ortak bileşenleri (alt menü barları, header'lar vb.) korumasını sağlayan hiyerarşik yapı.
2.**Route Groups (Parantezli Klasörler - `(tabs)`, `(auth)`):** Dosya yollarını URL'de görünmeyen mantıksal gruplara ayırarak düzenleme yöntemi.
3.**Dynamic Routes (Dinamik Rotalar - `[id]`):** Köşeli parantezler kullanılarak URL üzerinden parametre (ID) alabilen esnek sayfa yapıları oluşturma mantığı.

## Takıldığım hata ve çözümü
- **Hata:** Dinamik rota klasörü içindeki alt dosyalara (`[id]/camera.tsx`) geçiş yaparken Expo Router'ın parametre eşlemesinde yol (path) uyuşmazlığı yaşaması.
- **Çözüm:** Dosya yolları ve klasör hiyerarşisi Expo Router kurallarına uygun olarak (`[id]` klasörünün altına ilgili alt ekranlar eklenerek) yeniden düzenlendi.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `const { id } = useLocalSearchParams();`
- **Açıklamam:** Bu satır, dinamik rota yapısındaki (`[id].tsx`) URL'in içinde gelen parametreyi (bitki kimliğini) yakalayıp ekranda veya sayfa işlemlerinde kullanabilmemizi sağlayan Expo Router kancasıdır (hook).