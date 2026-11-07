// PlutoHacks Copilot warm-up
// Type the comments from the README (step 4) below this line, press Enter,
// then press Tab to accept Copilot's gray suggestion.

```js
// function that takes an end date and returns the days, hours, minutes, and seconds left until then
```

function timeUntil(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) {
    return "0 days, 0 hours, 0 minutes, 0 seconds";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

```js
// format that result as a string like "2d 5h 12m 3s"
```

function formatTimeUntil(endDate) {
  const timeLeft = timeUntil(endDate);

  const [days, hours, minutes, seconds] = timeLeft.split(", ").map(part => parseInt(part));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
