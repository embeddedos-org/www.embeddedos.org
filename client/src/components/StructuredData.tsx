interface StructuredDataProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export default function StructuredData({ schema }: StructuredDataProps) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
