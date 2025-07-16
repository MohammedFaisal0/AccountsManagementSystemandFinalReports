import React from 'react';

export default function ImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="import-layout">
      {children}
    </div>
  );
}