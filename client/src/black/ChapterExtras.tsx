import { CHAPTER_EXTRAS, STATUS_LABEL } from "./extras";

/** The large word the 3D story set over this chapter (decorative, as it was). */
export function ChapterWord({ id }: { id: string }) {
  const word = CHAPTER_EXTRAS[id]?.word;
  return word ? (
    <p className="bk-kw" aria-hidden="true">
      {word}
    </p>
  ) : null;
}

/**
 * What the 3D story showed when a part was pointed at, and the designs its
 * ribbons listed, under the chapter's own cards. Statuses use the legend's
 * words.
 */
export function ChapterExtras({ id }: { id: string }) {
  const x = CHAPTER_EXTRAS[id];
  if (!x || (!x.design && !x.notes && !x.robot && !x.line)) return null;
  return (
    <div className="bk-more">
      {x.design && (
        <p className="bk-design">
          <b>{x.design[0]}</b> {x.design[1]}
        </p>
      )}
      {(x.notes || x.robot) && (
        <>
          <h4>Parts, and what EoS does with them</h4>
          <ul className="bk-parts">
            {x.notes?.map(([label, note, st], i) => (
              <li key={"n" + i}>
                <span className="lb">{label || "The device"}</span>
                <span className="nt">{note}</span>
                <span className={"st s-" + st}>{STATUS_LABEL[st]}</span>
              </li>
            ))}
            {x.robot?.map(([name, spec, note, st], i) => (
              <li key={"r" + i}>
                <span className="lb">
                  {name}
                  <small>{spec}</small>
                </span>
                <span className="nt">{note}</span>
                <span className={"st s-" + st}>{STATUS_LABEL[st]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {x.line && (
        <>
          <h4>
            {/^e[A-Z]/.test(x.line.head)
              ? `Designs in the ${x.line.head} line`
              : x.line.head}
          </h4>
          <ul className="chips items">
            {x.line.items.map(([name, st], i) => (
              <li key={i} className={"s-" + st} title={STATUS_LABEL[st]}>
                {name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
