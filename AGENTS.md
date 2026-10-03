<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Resident and Admin experiences under one shared React state tree, with `/admin/*` reserved for admin screens, because this demo must remain frontend-only while keeping account roles separate.
- Keep problem-report details, remarks, and status changes in the shared admin React store so the table and modal stay synchronized without persistence.
- Keep admin document drafts and generated previews in React state, and use the browser print dialog for printing or saving a PDF, because official Barangay 902 formats and persistence are not yet available.
- Keep resident verification records and approval/account-activation feedback in the shared frontend-only admin store; never store or display government ID numbers in this demo.
- Keep authored app source in .jsx files and keep src/components/ui limited to components actually imported; build configuration may use .mjs/.ts and routeTree.gen.ts remains generated — why: the user requested a JSX-only app source and a lean codebase.
- Announcement broadcasts use a shared localStorage channel: src/lib/broadcasts.js owns the `eb902-announcements` key and helpers; both barangay-store (resident announcements list) and admin-store (notification bell) import it — never duplicate the key or the notification shape, and never import admin-store from barangay-store (circular).
