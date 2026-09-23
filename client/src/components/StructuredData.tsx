interface StructuredDataProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export default function StructuredData({ schema }: StructuredDataProps) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(schema).replace(/</g, "\\u003c")}
    </script>
  );
}
