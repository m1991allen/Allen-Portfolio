import { contact, nav, site } from "@/data/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-32 bg-ink text-paper">
      <div className="shell py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* 品牌 + CTA */}
          <div>
            <p className="display text-3xl leading-snug text-paper sm:text-4xl">
              有專案想合作，
              <br />
              或只是想聊聊？
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-sm text-ink transition-colors hover:bg-accent hover:text-paper"
            >
              寄信給我
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* 網站導覽 */}
          <div>
            <p className="eyebrow text-paper/45">導覽</p>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={contact.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm text-paper/70 transition-colors hover:text-paper"
                >
                  舊版履歷
                </a>
              </li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <p className="eyebrow text-paper/45">聯絡我</p>
            <ul className="mt-6 space-y-4 text-sm text-paper/70">
              <li>
                <span className="block text-xs text-paper/40">Email</span>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline transition-colors hover:text-paper"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="block text-xs text-paper/40">電話</span>
                <a
                  href={contact.phoneHref}
                  className="link-underline transition-colors hover:text-paper"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <span className="block text-xs text-paper/40">所在地</span>
                <span>{contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/12 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Designed &amp; built by Allen Liu.</p>
        </div>
      </div>
    </footer>
  );
}
