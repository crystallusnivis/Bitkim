# Aşama 1: Boş Uygulama ve Dosya Turu

## 1.Ne Yaptım
- Expo Router ve TypeScript destekli boş bir Expo projesi oluşturdum.
- Projedeki örnek kodları sildim ve yapay zekanın verdiği kodları yadım.(`reset-project` mantığıyla) 
- Proje `npx expo start` komutunu yazarak Expo Go uygulaması üzerinden görmeye çalıştım ama Expo Go hata verip durdu.
## Oluşan / değişen dosyalar
| Dosya | Ne işe yarıyor | İçinde ne var |
|---|---|---|
| `app.json` | Expo uygulamasının genel ayarlarını ve meta verilerini barındırır. | Uygulama adı, slug, versiyon, ikon ve platform ayarları. |
| `tsconfig.json` | TypeScript derleyicisinin kurallarını ve ayarlarını belirler. | Derleme hedefi, katı mod ayarları ve path alias yapılandırmaları. |
| `app/_layout.tsx` | Tüm ekranları sarmalayan ana şablon ve üst düzey yönlendiricidir. | Ortak sağlayıcılar (Providers) veya Stack/Tabs yönlendirme yapıları. |
| `app/index.tsx` | Uygulama ilk açıldığında çalışan kök rotadır (ana sayfa). | Ekranda gösterilecek temel bileşen ve yönlendirme mantığı (`Redirect`). |
| `package.json` | Proje bağımlılıklarını ve çalıştırma betiklerini (scripts) listeler. | Kütüphane versiyonları (`dependencies`) ve `start`, `build` gibi komutlar. |
| `.gitignore` | Git versiyon kontrolünün takip etmeyeceği dosyaları belirtir. | `node_modules`, `.env`, `.expo` gibi hassas veya geçici klasörler. |

## Öğrendiğim 3 kavram
1.**File-based Routing (Dosya Tabanlı Yönlendirme):** Klasör ve dosya isimlerinin doğrudan uygulamanın URL rotalarını belirlemesi mantığı.
2.**Bundler (Derleyici / Paketleyici):** Kodlarımızı akıllı telefonun veya tarayıcının anlayabileceği JavaScript paketlerine dönüştüren araç (Metro).
3.**Dependencies & DevDependencies:** Projenin çalışması için gereken paketler ile sadece geliştirme aşamasında kullanılan araçların ayrımı.

## Takıldığım hata ve çözümü
- **Hata:** Kök dizindeki `index.tsx` ile `(tabs)/index.tsx` dosyalarının çakışması nedeniyle Expo Router'ın yönlendirmeyi şaşırıp "Element type is invalid" hatası vermesi.
- **Çözüm:** Kök `app/index.tsx` dosyası sadeleştirilerek doğrudan `/(tabs)` dizinine yönlendirme (`<Redirect href="/(tabs)" />`) yapacak şekilde güncellendi ve önbellek temizlendi.

## AI'ın yazıp ilk başta anlamadığım satır ve şimdiki açıklamam
- **Satır:** `import { Redirect } from 'expo-router';` ve `<Redirect href="/(tabs)" />;`
- **Açıklamam:** Bu satır, kullanıcı uygulamaya ilk girdiğinde herhangi bir görsel render etmek yerine doğrudan sekmeli ana sayfa yapısına (`/(tabs)`) yönlendirilmesini sağlayan yönlendirici bir bileşendir.
