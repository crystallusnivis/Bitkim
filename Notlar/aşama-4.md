# Aşama 4 – Giriş ve güvenlik (Auth + RLS)

## Ne yaptım
Supabase Auth kullanarak e-posta ve şifre ile kullanıcı kayıt ve giriş akışını oluşturdum. Oturum durumuna göre kullanıcıyı otomatik olarak yönlendiren bir mekanizma kurdum. Ardından veritabanı güvenliğini sağlamak için RLS (Row Level Security) özelliğini aktif hale getirdim ve `plants` tablosu için kullanıcı bazlı okuma, ekleme ve silme politikaları (policies) tanımladım. Son olarak form verilerini Supabase'e kaydeden bitki ekleme (`add-plant.tsx`) ekranını tamamladım.

## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| `app/(auth)/login.tsx` | Kullanıcıların sisteme giriş yapmasını veya kayıt olmasını sağlar. | E-posta/şifre inputları, giriş/kayıt butonları ve auth tetikleyicileri. |
| `src/api/auth.ts` | Kimlik doğrulama işlemlerini (giriş, çıkış, oturum kontrolü) yönetir. | Supabase Auth fonksiyonları (`signInWithPassword`, `signOut` vb.). |
| `app/add-plant.tsx` | Yeni bitki verilerini alıp veritabanına kaydetme formunu barındırır. | Form state'leri, input alanları ve `owner_id` eşleşmeli kayıt mantığı. |

## Öğrendiğim 3 kavram 
1.**Row Level Security (RLS - Satır Düzeyinde Güvenlik):** Veritabanındaki tablolara kimin hangi satırı okuyabileceğini veya değiştirebileceğini kural olarak dayatan veritabanı güvenlik katmanı.
2.**Session Persistence (Oturum Kalıcılığı):** Kullanıcı uygulamayı kapatıp açsa bile oturumunun telefonda (`AsyncStorage`) güvenli bir şekilde saklanarak her seferinde tekrar giriş yapma zorunluluğunu ortadan kaldırma mantığı.
3.**Authentication vs. Authorization:** Kullanıcının kim olduğunu doğrulamak (Auth) ile sistem içinde hangi verilere erişmeye yetkili olduğunu belirlemek (RLS/Policies) arasındaki temel fark.
4.user_id(kullanıcı)=owner_id(sahipi)
5.owner_id-bitki tablosu
  user_id-fotoğtağ veya log tablosu
  author_id-notlar tablosu

## Takıldığım hata ve çözümü
- **Hata:** RLS kapalıyken herhangi bir kullanıcının veritabanındaki tüm bitkileri silebilmesi ve güvenlik açığı oluşması.
- **Çözüm:** RLS etkinleştirilerek `auth.uid() = owner_id` koşulunu sağlayan güvenlik politikaları yazıldı, böylece kullanıcıların yalnızca kendi bitkileri üzerinde işlem yapabilmesi sağlandı.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `auth.uid() = owner_id`
- **Açıklamam:** Bu SQL koşulu, işlem yapan o anki kullanıcının benzersiz kimliği ile tablodaki satırın sahibi olan kişinin kimliğinin eşleşip eşleşmediğini kontrol ederek yetkisiz erişimleri engeller.