# Judo Tracker - System Zarządzania Treningami Judo

## 📋 Opis Projektu

**Judo Tracker** to kompleksowa aplikacja webowa do zarządzania treningami sportowców uprawiających judo. System umożliwia trenerom efektywne planowanie, monitorowanie i analizowanie procesu treningowego zawodników, a zawodnikom śledzenie własnych postępów i dostęp do materiałów szkoleniowych.

## 👥 Role Użytkowników

System obsługuje dwa główne typy użytkowników:

### 🎓 Trener (Coach)
Rola zarządzająca z pełnym dostępem do planowania treningów, monitorowania zawodników i analizy danych.

### 🥋 Zawodnik (Player)
Rola z dostępem do przeglądania swoich treningów, statystyk i materiałów udostępnionych przez trenera.

---

## 🎯 Możliwości Trenera

### 1. Zarządzanie Zawodnikami

#### Dodawanie Zawodników
- Tworzenie profili nowych zawodników
- Konfiguracja danych logowania
- Przypisywanie do grup treningowych (senior, junior, młodszy senior, młodzik)
- Automatyczne generowanie loginów i haseł
- Możliwość resetowania hasła zawodnika

#### Przeglądanie i Zarządzanie Profilami
- Podgląd listy wszystkich zawodników
- Edycja informacji o zawodniku
- Usuwanie zawodników z systemu
- Szybki dostęp do szczegółowych informacji o zawodniku

### 2. Planowanie Aktywności Treningowych

#### Rodzaje Aktywności
System pozwala na planowanie różnych typów aktywności:
- **Treningi taktyczne** (oznaczone kolorem niebieskim)
- **Treningi motoryczne** (oznaczone kolorem czerwonym)
- **Treningi mentalne** (oznaczone kolorem zielonym)
- **Treningi biegowe** z możliwością określenia dystansu w metrach
- **Treningi na macie** z możliwością dodawania ćwiczeń
- **Obozy treningowe**

#### Funkcje Planowania
- Dodawanie pojedynczych aktywności
- Dodawanie aktywności wielodniowych (np. obozy)
- Przypisywanie aktywności do wielu zawodników jednocześnie
- Filtrowanie zawodników według grup podczas dodawania aktywności
- Duplikowanie istniejących aktywności
- Zapisywanie schematów aktywności do wielokrotnego użycia
- Ręczna zmiana kolejności aktywności w ramach treningu

#### Szczegóły Ćwiczeń
Dla każdego ćwiczenia można określić:
- Liczbę serii
- Czas trwania (minuty i sekundy) dla każdej serii osobno
- Przerwy między seriami
- Przerwy między interwałami
- Opis i cel ćwiczenia
- Możliwość dodawania wielu identycznych aktywności w ramach jednego treningu

#### Edycja i Zarządzanie
- Edycja zaplanowanych aktywności
- Usuwanie aktywności
- Przy edycji/usuwaniu aktywności wieloosobowej, zmiany dotyczą wszystkich przypisanych zawodników

### 3. Przeglądanie i Analiza

#### Widoki Kalendarza
- **Widok dzienny** - szczegółowy przegląd aktywności w wybranym dniu
- **Widok tygodniowy** - przegląd całego tygodnia treningowego zawodnika
- **Widok miesięczny** - przegląd miesiąca z możliwością zaznaczania aktywności
- **Widok roczny** - długoterminowa analiza z możliwością zaznaczania aktywności

#### Statystyki Zawodnika
- Wizualizacja postępów na wykresach
- Podsumowanie tygodnia/miesiąca/roku w postaci liczby rodzajów treningów
- Osobne wykresy dla różnych typów statystyk
- Możliwość zaznaczania aktywności i wyliczania statystyk na ich podstawie (widok roczny)
- Oznaczenia ważnych wydarzeń (np. obozy) na wykresach
- Podpisane miesiące na osi X dla lepszej orientacji
- Optymalizowana prezentacja zmian wagi (drobne zmiany są mniej widoczne)
- Opis znaczenia emotek na wykresach

#### Moduł Obozów
- Osobna zakładka dedykowana obozom treningowym
- Przeglądanie informacji o obozach
- Oznaczanie obozów na wykresach statystyk jako ważne wydarzenia

### 4. Notatki o Zawodnikach

#### System Notatek Personalnych
Trener może prowadzić szczegółowe notatki o każdym zawodniku zawierające:
- Jak zawodnik walczy
- Co można na nim zrobić
- Na co uważać podczas walki
- Mocne strony w parterze

#### Notatki o Przeciwnikach
- Tworzenie notatek o przeciwnikach zawodników
- Wyszukiwanie w notatkach
- Edycja i aktualizacja informacji
- Organizacja notatek w wątki tematyczne

### 5. Materiały Wideo

#### Biblioteka Wideo
- Dodawanie filmów instruktażowych
- Udostępnianie filmów zawodnikom
- Przeglądanie i zarządzanie biblioteką wideo
- Usuwanie filmów z systemu
- Sortowanie filmów po dacie (planowane)

### 6. Komunikacja

#### System Powiadomień SMS
- Wysyłanie powiadomień SMS do zawodników
- Możliwość wysyłania SMS podczas dodawania aktywności (jednodniowej i wielodniowej)
- Licznik wysłanych wiadomości
- Integracja z API SMSPlanet

### 7. Analiza Wideo

#### Narzędzia Analizy
- Dodawanie zdjęć do analizy walk
- Rysowanie i adnotacje na zdjęciach
- Zmiana kolejności zdjęć
- Usuwanie zdjęć i analiz
- Podgląd analiz wideo (wide view)
- Scrollowanie podczas pracy z analizami (w rozwoju)

---

## 🥋 Możliwości Zawodnika

### 1. Przeglądanie Treningów

#### Widoki Kalendarzowe
- **Widok dzienny** - szczegółowy przegląd aktywności w danym dniu
- **Widok tygodniowy** - przegląd tygodnia treningowego
- Możliwość przechodzenia do wybranego dnia z widoku tygodniowego i miesięcznego
- Sensowny powrót do widoku po przeglądaniu starych aktywności

#### Szczegóły Aktywności
- Przeglądanie zaplanowanych treningów
- Dostęp do szczegółów ćwiczeń
- Informacje o czasie trwania i liczbie serii
- Wyświetlanie kolorowych oznaczeń typów aktywności

### 2. Własne Aktywności

#### Możliwość Dodawania Aktywności
- Zawodnik może tworzyć własne aktywności
- Podsumowywanie treningów wykonanych poza planem trenera
- Rejestrowanie dodatkowych aktywności treningowych
- Możliwość usuwania własnych aktywności (w rozwoju)

### 3. Notatki

#### Prowadzenie Notatek
- Dodawanie własnych notatek treningowych
- Edycja istniejących notatek
- Przeglądanie historii notatek
- Wyszukiwanie w notatkach

#### Notatki o Przeciwnikach
- Tworzenie notatek o przeciwnikach
- Organizacja notatek w wątki tematyczne
- Edycja i aktualizacja informacji

### 4. Dostęp do Materiałów

#### Biblioteka Wideo
- Dostęp do filmów udostępnionych przez trenera
- Przeglądanie materiałów instruktażowych
- Możliwość oglądania filmów szkoleniowych

### 5. Zarządzanie Profilem

#### Profil Użytkownika
- Przeglądanie informacji profilowych
- Edycja danych osobowych
- Zmiana hasła z podglądem wprowadzanych znaków
- Podgląd hasła podczas jego zmiany

---

## 📊 Główne Moduły Systemu

### 1. Moduł Autoryzacji
- System logowania dla trenerów i zawodników
- Bezpieczne przechowywanie haseł (szyfrowanie bcrypt)
- Podgląd hasła przy logowaniu
- Zarządzanie sesjami użytkowników

### 2. Moduł Zarządzania Zawodnikami
- Baza danych zawodników
- Grupy treningowe
- Profile zawodników
- Historia aktywności

### 3. Moduł Planowania Treningów
- Kalendarz treningowy
- Różne typy aktywności
- Schematy treningowe
- Aktywności wielodniowe

### 4. Moduł Statystyk
- Wykresy danych raportowanych przez zawodników

### 5. Moduł Notatek
- Notatki personalne o zawodnikach
- Notatki o przeciwnikach
- System wyszukiwania
- Organizacja w wątki

### 6. Moduł Wideo
- Biblioteka materiałów
- Udostępnianie filmów
- Zarządzanie plikami
- Analiza wideo z adnotacjami (zrzuty ekranów, oznaczenia na obrazkach, zapis do bazy danych)

### 7. Moduł Komunikacji
- Powiadomienia SMS
- Komunikacja z zawodnikami

### 8. Moduł Raportowania
- Zgłaszanie błędów
- Feedback od użytkowników

---

## 🎨 Cechy Systemu

### Intuicyjny Interface
- Responsywny design dostosowany do różnych urządzeń
- Sidebar z szybkim dostępem do funkcji

### Elastyczność
- Możliwość dostosowania do indywidualnych potrzeb trenera
- Zapisywanie schematów treningowych
- Duplikowanie aktywności

### Kompleksowość
- Obsługa pełnego cyklu treningowego
- Od planowania przez realizację do analizy
- Integracja różnych aspektów treningu

### Dostępność
- Dostęp z dowolnego miejsca przez przeglądarkę
- Synchronizacja danych w czasie rzeczywistym

---

## 🔄 Ciągły Rozwój

System jest aktywnie rozwijany z planowanymi ulepszeniami takimi jak:
- Usprawnienie usuwania plików ze storage
- Możliwość blokowania ponownego wysyłania podczas trwającego procesu
- Poprawa stylów notatek
- Sortowanie filmów po dacie
- Obsługa scrollowania podczas rysowania po zdjęciach
- Usuwanie aktywności stworzonych przez zawodnika

---

## 📱 Dostęp do Aplikacji

Aplikacja jest dostępna przez przeglądarkę internetową i wymaga:
- Konta użytkownika (trener lub zawodnik)
- Loginu i hasła
- Połączenia z internetem
---

## 📞 Wsparcie

System zawiera wbudowany moduł zgłaszania błędów, który umożliwia użytkownikom bezpośrednie raportowanie problemów i sugestii dotyczących aplikacji.

---

