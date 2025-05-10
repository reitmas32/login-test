
// app/verify/page.tsx
//export const dynamic = 'force-dynamic';  // fuerza SSR/CSR, no SSG
"use client"; // Si tu página usa hooks de estado o efectos

import { VerifyClient } from "@/components/VerifyClient";
import { Suspense } from "react";

export default function VerifyPage() {
    // Aquí NO hay hooks de cliente ni useSearchParams
    return (
        <Suspense>
            <VerifyClient />;
        </Suspense>
    )
}
