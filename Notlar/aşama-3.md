# Aşama 3 – Supabase bağlantısı ve ilk tablo

## Ne yaptım
Supabase üzerinde yeni bir bulut veritabanı projesi oluşturarak bağlantı ayarlarını yapılandırdım. Hassas anahtarları `.env` dosyası ile güvenli tutarak `src/lib/supabase.ts` üzerinden istemci bağlantısını kurdum. SQL Editor kullanarak `plants` ve `quotes` tablolarını oluşturdum, ardından veritabanı sorgularını bileşenlerden ayırmak için `src/api/plants.ts` katmanını yazdım.

## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| `.env` | Projeye ait gizli yapılandırma anahtarlarını güvenli şekilde saklar. | Supabase Project URL ve `anon key` değerleri. |
| `src/lib/supabase.ts` | Supabase istemcisini (`createClient`) başlatıp proje genelinde erişilebilir kılar. | Bağlantı nesnesi ve yerel depolama (`AsyncStorage`) ayarları. |
| `src/api/plants.ts` | Veritabanı ile iletişim kuran ve sorguları yöneten servis dosyasıdır. | `getPlants()` gibi veri çekme fonksiyonları. |

## Öğrendiğim 3 kavram 
1.**Environment Variables (.env - Çevre Değişkenleri):** Hassas API anahtarlarını kod deposundan (`GitHub`) gizleyerek güvenli bir şekilde yönetme yöntemi.
2.**Anon Key vs. Service Role Key:** `anon` anahtarının istemci tarafında güvenli kısıtlamalarla kullanılabileceğini, `service_role` anahtarının ise tüm RLS kurallarını bypass eden tam yetkili bir sunucu anahtarı olduğunu ve asla mobil uygulamaya gömülmemesi gerektiğini.
3.**API Layer Separation (Veri Katmanı Ayrımı):** UI (ekran) bileşenlerinin içine doğrudan veritabanı sorguları yazmak yerine, bu işlemleri `src/api/` altında toplayarak kodun düzenini ve test edilebilirliğini artırma mantığı.

## Takıldığım hata ve çözümü
- **Hata:** Supabase istemcisini başlatırken kullanılan çevre değişkenlerinin Expo ortamında doğru okunamaması ve bağlantının `undefined` dönmesi.
- **Çözüm:** Expo projelerinde değişkenlerin istemci tarafında okunabilmesi için `EXPO_PUBLIC_` önekiyle tanımlanması gerektiği öğrenildi ve `.env` dosyası buna göre güncellendi.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `export const supabase = createClient(supabaseUrl, supabaseAnonKey, ...);`
- **Açıklamam:* Bu satır, Supabase veritabanımızla güvenli bir köprü kurarak uygulama içerisinden verileri okumamıza, yazmamıza ve sorgulamamıza olanak tanıyan ana istemci nesnesini oluşturur.