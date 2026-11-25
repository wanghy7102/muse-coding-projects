# Muse Coding Projects

A small example tracker for coding projects, built with Muse.

Add a project with a name, language/stack, status, note, and optional repo
link, then move it through three columns: Idea, Building, Shipped.
Cards also support edit and delete.

## Run it

Open `index.html` in a browser, or serve the folder with any static host
(for example GitHub Pages).

No build step and no dependencies. Projects are saved in the browser only
(`localStorage`), so each browser keeps its own list.

## Files

- `index.html` — page structure and the add-project form
- `styles.css` — layout and styling
- `app.js` — add, move, edit, delete, and local saving
