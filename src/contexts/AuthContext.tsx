import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const manualSignOutRef = useRef(false);

  const applyAuthState = (nextSession: Session | null) => {
    setSession((prev) =>
      prev?.access_token === nextSession?.access_token ? prev : nextSession
    );
    setUser((prev) => {
      const nextUser = nextSession?.user ?? null;
      return prev?.id === nextUser?.id ? prev : nextUser;
    });
    setLoading(false);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "TOKEN_REFRESHED") return;

      // Evita logout por eventos transitórios durante refresh/rate-limit
      if (event === "SIGNED_OUT" && !manualSignOutRef.current) {
        window.setTimeout(async () => {
          const {
            data: { session: recoveredSession },
          } = await supabase.auth.getSession();
          applyAuthState(recoveredSession ?? null);
        }, 250);
        return;
      }

      applyAuthState(nextSession);
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      applyAuthState(initialSession ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    manualSignOutRef.current = true;
    try {
      await supabase.auth.signOut();
    } finally {
      manualSignOutRef.current = false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
