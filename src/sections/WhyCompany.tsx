import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';
import { useT } from '../i18n/context';

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base leading-[1.5]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function WhyCompany() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.whyCompany.eyebrow}</Eyebrow>
        <H2 className="mb-4">{t.whyCompany.title}</H2>
        <Lead className="mb-10">{t.whyCompany.lead}</Lead>
      </Reveal>

      <Reveal group className="flex flex-wrap gap-6">
        <RevealItem className="box-border flex-[1_1_300px] rounded-[28px] bg-mist p-8">
          <H3 className="mb-[18px]">{t.whyCompany.realityTitle}</H3>
          <List items={t.whyCompany.reality} />
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_300px] rounded-[28px] border border-line bg-white p-8">
          <h3 className="m-0 mb-[18px] text-xl font-semibold text-green">
            {t.whyCompany.forEmployeeTitle}
          </h3>
          <List items={t.whyCompany.forEmployee} />
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_300px] rounded-[28px] border border-line bg-white p-8">
          <h3 className="m-0 mb-[18px] text-xl font-semibold text-green">
            {t.whyCompany.forCompanyTitle}
          </h3>
          <List items={t.whyCompany.forCompany} />
        </RevealItem>
      </Reveal>
    </section>
  );
}
