import { useState, useCallback } from 'preact/hooks';

export default function ResumeVerifier({ expectedHash }: { expectedHash: string }) {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'match' | 'mismatch'>('idle');
  const [hash, setHash] = useState<string | null>(null);

  const onDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (!file) return;

    setStatus('verifying');
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
      setStatus(hashHex === expectedHash ? 'match' : 'mismatch');
    } catch (err) {
      setStatus('mismatch');
    }
  }, [expectedHash]);

  const onDragOver = (e: DragEvent) => e.preventDefault();

  return (
    <div class="border border-[var(--rule)] bg-[var(--paper)] p-8 w-full max-w-2xl relative shadow-sm">
      <div class="absolute -top-3 -right-3 bg-[var(--ink)] text-[var(--paper)] px-2 py-1 font-mono text-[9px]">
        F7 :: INTEGRITY_CHECK
      </div>
      
      <h3 class="font-display text-3xl mb-4">Résumé Integrity Verifier</h3>
      <p class="font-sans text-[var(--ink)]/80 mb-8 max-w-lg leading-relaxed">
        In security, trust is cryptographic. Drop the downloaded résumé PDF below to hash it locally via WebCrypto and verify it matches the published signature. Nothing leaves your browser.
      </p>

      <div 
        onDrop={onDrop}
        onDragOver={onDragOver}
        class={`border-2 border-dashed p-12 flex flex-col items-center justify-center cursor-pointer transition-colors mb-8 group
          ${status === 'match' ? 'border-green-500 bg-green-500/5' : 
            status === 'mismatch' ? 'border-[var(--signal)] bg-[var(--signal)]/5' : 
            'border-[var(--rule)] hover:border-[var(--signal)]'}`}
      >
        <div class="font-mono text-xs tracking-widest uppercase transition-colors text-[var(--ink)]/50 group-hover:text-[var(--signal)]">
          {status === 'idle' && 'Drag & Drop Resume.pdf Here'}
          {status === 'verifying' && 'Hashing File...'}
          {status === 'match' && <span class="text-green-600 font-bold">✓ INTEGRITY VERIFIED</span>}
          {status === 'mismatch' && <span class="text-[var(--signal)] font-bold">✗ HASH MISMATCH</span>}
        </div>
      </div>

      <div class="font-mono text-[10px] space-y-3 bg-[var(--ink)]/5 p-4 border border-[var(--rule)]">
        <div class="flex justify-between items-center">
          <span class="text-[var(--ink)]/60">EXPECTED SHA-256</span>
          <span class="truncate ml-4 max-w-[250px] md:max-w-[300px] text-[var(--ink)] bg-[var(--paper)] px-2 py-1 border border-[var(--rule)]" title={expectedHash}>
            {expectedHash}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[var(--ink)]/60">COMPUTED SHA-256</span>
          <span class={`truncate ml-4 max-w-[250px] md:max-w-[300px] px-2 py-1 border ${
              status === 'match' ? 'text-green-600 border-green-500 bg-green-500/10' : 
              status === 'mismatch' ? 'text-[var(--signal)] border-[var(--signal)] bg-[var(--signal)]/10' : 
              'text-[var(--ink)]/50 border-[var(--rule)] bg-[var(--paper)]'
            }`} title={hash || ''}>
            {hash || 'AWAITING FILE...'}
          </span>
        </div>
      </div>
    </div>
  );
}
