import { Link } from 'react-router'
import { Seo } from '../../app/Seo'
import { NeedsInput } from '../../components/manga'
import { Mascot } from '../../components/manga/Mascot'
import { CopyButton } from '../../components/ui/CopyButton'
import { IconDownload, IconMail, linkIcon } from '../../components/ui/icons'
import { InkButton } from '../../components/ui/InkButton'
import { experience } from '../../data/experience'
import { featuredProjects } from '../../data/projects'
import { profile } from '../../data/profile'
import { skills } from '../../data/skills'
import { periodLabel } from '../../utils/labels'
import s from './recruiter.module.css'

/**
 * Hire brief (Direction K dossier). Clarity over decoration: everything a
 * recruiter needs sits within one scroll; résumé and email are always one tap away.
 */
export default function RecruiterPage() {
  const links = profile.links.filter((l) => l.showOnRecruiter)
  const jobs = experience.filter((e) => e.kind !== 'education' && e.track !== 'origin')
  const education = experience.find((e) => e.kind === 'education')

  return (
    <div className={`on-paper ${s.page}`}>
      <Seo />
      <div className={`page ${s.inner}`}>
        {/* Quick profile */}
        <header className={s.head}>
          <p className={s.file}>
            <span>HIRE BRIEF</span> File 00 · Quick profile
          </p>
          <h1 className={s.name}>{profile.name}</h1>
          <p className={s.role}>{profile.role}</p>
        </header>

        <NeedsInput items={profile.needsInput} />

        <section className={s.dossier} aria-labelledby="profile-title">
          <h2 id="profile-title" className="sr-only">
            Quick profile
          </h2>
          <dl className={s.facts}>
            <dt>Experience</dt>
            <dd>About {profile.experienceYears} years (since {profile.experienceSince.slice(0, 4)})</dd>
            <dt>Focus</dt>
            <dd>{profile.expertise.join(' · ')}</dd>
            <dt>Status</dt>
            <dd>
              <strong>{profile.availability}</strong>
            </dd>
            {profile.location && (
              <>
                <dt>Location</dt>
                <dd>{profile.location}</dd>
              </>
            )}
            {profile.employmentPreferences && (
              <>
                <dt>Looking for</dt>
                <dd>{profile.employmentPreferences}</dd>
              </>
            )}
            <dt>{profile.nextArc.label}</dt>
            <dd>{profile.nextArc.title}: in training</dd>
          </dl>
          <Mascot className={`${s.portrait} no-print`} mask="down" armed={false} />
        </section>

        <div className={s.actions}>
          <InkButton href={profile.resume.href} download={profile.resume.fileName} icon={<IconDownload />}>
            Download résumé (PDF)
          </InkButton>
          <CopyButton value={profile.email} label="Copy email" className={s.copy} />
        </div>

        <section aria-labelledby="contact-title" className={s.section} data-reveal-item>
          <h2 id="contact-title" className={s.h2}>
            Contact
          </h2>
          <ul className={s.contacts}>
            {links.map((l) => {
              const Icon = linkIcon[l.id]
              const external = l.href.startsWith('http')
              return (
                <li key={l.id}>
                  <a href={l.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <Icon />
                    <span className={s.contactLabel}>{l.label}</span>
                    <span className={s.contactHandle}>{l.handle}</span>
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="skills-title" className={s.section} data-reveal-item>
          <h2 id="skills-title" className={s.h2}>
            Technical skills
          </h2>
          <dl className={s.skills}>
            {skills.map((c) => (
              <div key={c.id} className={s.skillRow}>
                <dt>{c.title}</dt>
                <dd>{c.skills.map((k) => k.name).join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="snapshot-title" className={s.section} data-reveal-item>
          <h2 id="snapshot-title" className={s.h2}>
            Experience snapshot
          </h2>
          <ol className={s.snapshot}>
            {jobs.map((e) => (
              <li key={e.id}>
                <p className={s.snapDates}>{periodLabel(e)}</p>
                <p className={s.snapRole}>
                  <strong>{e.role}</strong> · {e.organization}
                </p>
                {e.summary && <p className={s.snapSummary}>{e.summary}</p>}
              </li>
            ))}
          </ol>
          {education && (
            <p className={s.education}>
              <strong>Education:</strong> {education.role}, {education.organization} (
              {education.startDate?.slice(0, 4)}–{education.endDate?.slice(0, 4)})
            </p>
          )}
          <p>
            <Link to="/experience" className={s.more}>
              Full career arc →
            </Link>
          </p>
        </section>

        <section aria-labelledby="work-title" className={s.section} data-reveal-item>
          <h2 id="work-title" className={s.h2}>
            Featured work
          </h2>
          <ul className={s.work}>
            {featuredProjects().map((p) => (
              <li key={p.id}>
                <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                <span>{p.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Phones: résumé + email always one tap away */}
      <div className={`${s.sticky} no-print`} aria-label="Quick actions" role="region">
        <a href={profile.resume.href} download={profile.resume.fileName} className={s.stickyPrimary}>
          <IconDownload /> Résumé
        </a>
        <a href={`mailto:${profile.email}`} className={s.stickySecondary}>
          <IconMail /> Email
        </a>
      </div>
    </div>
  )
}
