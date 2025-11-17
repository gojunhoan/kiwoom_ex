import '../../public/scss/globals.scss';
import type { ReactNode } from 'react';

export default function PublishingLayout({ children }: { children: ReactNode }) {
  return (
    <section data-docs-section="publishing">
      {children}
    </section>
  );
}