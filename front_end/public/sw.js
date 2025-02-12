self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Nowe powiadomienie!";
    const options = {
      body: data.body || "Dodano nowy rekord w tabeli.",
      icon: "/icon.png"
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
  