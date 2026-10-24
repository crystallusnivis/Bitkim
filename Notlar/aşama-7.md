# Aşama 7 – Veriyi ekrana göre şekillendirme (RPC)

## Ne yaptım
Ana sayfanın birden fazla ayrı sorgu atarak ağ trafiği yaratmasını önlemek amacıyla Supabase üzerinde `get_home()` adında özel bir PostgreSQL fonksiyonu (RPC) yazdım. Bu tek sorgu sayesinde kullanıcının kendi bitkilerini (en son yüklenen kapak fotoğrafı ve toplam fotoğraf sayısı ile birlikte) ve günün sözünü tek seferde çektim. Ardından uygulamada `supabase.rpc()` metodunu kullanarak bu veriyi ana sayfaya entegre ettim.

## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| Supabase SQL Fonksiyonu (`get_home`) | Sunucu tarafında karmaşık sorguları birleştirerek tek paket veri döner. | JOIN, alt sorgular (`json_build_object`) ve `auth.uid()` filtreleme mantığı. |
| `src/api/home.ts` | Sunucu tarafındaki RPC fonksiyonunu uygulamadan tetikleyen servis dosyasıdır. | `getHomeData()` fonksiyonu ve TypeScript tip (interface) tanımları. |
| `app/(tabs)/home.tsx` | Tek seferde gelen optimize veriyi alarak ana sayfa arayüzünü besler. | Günün sözü alanı, bitki kartları listesi ve yüklenme durumları. |

## Öğrendiğim 3 kavram (Ekim 2026 Proje Geliştirme Sürecinde)
1. **Remote Procedure Call (RPC):** Veritabanı içinde önceden yazılmış özel SQL fonksiyonlarını istemci tarafından tek bir komutla çalıştırarak toplu işlemler yapma yöntemi.
2. **Data Shape Alignment (Veri Şekillendirme):** Ekranın ihtiyaç duyduğu karmaşık JSON yapısını veritabanı seviyesinde hazırlayarak front-end tarafındaki kod yükünü azaltma mantığı.
3. **Single Query Optimization (Tek Sorgu Performansı):** Birden fazla tabloyu ayrı ayrı sorgulamak yerine veritabanının gücünü kullanarak tek seferde (JOIN ile) veri çekmenin ağ gecikmelerini (latency) ne kadar çok azalttığı.

## Takıldığım hata ve çözümü
- **Hata:** RPC fonksiyonundan dönen özel JSON verisinin yapısı TypeScript tarafından tam bilinmediği için property'lere erişirken tip uyumsuzluğu yaşanması.
- **Çözüm:** `get_home()` fonksiyonunun döndüğü veri yapısına tam uygun bir TypeScript `interface` tanımı yazılarak tip güvenliği (type safety) sağlandı.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `const { data, error } = await supabase.rpc('get_home');`
- **Açıklamam:** Bu satır, doğrudan tablolardan veri çekmek yerine veritabanında bizim için önceden hazırlanmış özel bir fonksiyonu tetikler ve ana sayfanın tüm ihtiyaç duyduğu veriyi tek hamlede getirir.