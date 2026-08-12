# Medico Overseas Website V6

## Run locally
Open the project folder in VS Code and use Live Server on the project root.

- Home: `/`
- Do not manually force `/index.html` into nested links; navigation uses folder-relative URLs.
- On VS Code Live Server, enquiry forms validate the student's data and then open WhatsApp with the filled details. This works without PHP.
- On PHP hosting, the same forms also POST to `submit.php`, save the enquiry to `storage/leads.csv`, and attempt email delivery to `info@medicooverseas.com` before opening WhatsApp.

## Social links
Edit `assets/site-config.js` to replace Instagram/Facebook/X with the official Medico Overseas profile URLs. WhatsApp is configured to +91 93474 06969.

## V6 functional additions
- Crisp home hero using the source student image without the blurred wide composite.
- Dedicated Universities guide page.
- Searchable/clickable blog library with 8 article pages.
- Interactive Gallery with modal previews.
- Searchable/category-filtered FAQ page with 20 student/parent questions.
- Working destination enquiry forms with Live Server WhatsApp fallback and PHP lead storage on compatible hosting.
