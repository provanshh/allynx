import { supabase } from "@/integrations/supabase/client";

export const sendTelegramNotification = async (message: string) => {
  try {
    await supabase.functions.invoke("telegram-notify", {
      body: { message },
    });
  } catch (e) {
    console.error("Telegram notification failed:", e);
  }
};
