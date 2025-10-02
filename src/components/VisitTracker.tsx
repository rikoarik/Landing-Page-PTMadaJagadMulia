import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

let startTime: number | null = null;
let visitorId: string | null = null;

// Get or create visitor ID
function getVisitorId() {
  if (visitorId) return visitorId;
  
  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitorId", id);
  }
  
  visitorId = id;
  return id;
}

// Get device type
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    // Start timing when component mounts or route changes
    startTime = Date.now();

    // Record page visit
    const recordVisit = async () => {
      try {
        await supabase.from("page_visits").insert([{
          visitor_id: getVisitorId(),
          path: location.pathname,
          referrer: document.referrer,
          device_type: getDeviceType(),
        }]);
      } catch (error) {
        console.error("Error recording visit:", error);
      }
    };

    recordVisit();

    // Update duration when user leaves
    const updateDuration = async () => {
      if (!startTime) return;
      
      const duration = Math.floor((Date.now() - startTime) / 1000);
      try {
        await supabase
          .from("page_visits")
          .update({ duration })
          .match({ 
            visitor_id: getVisitorId(),
            path: location.pathname,
          })
          .order("created_at", { ascending: false })
          .limit(1);
      } catch (error) {
        console.error("Error updating visit duration:", error);
      }
    };

    // Update duration when component unmounts or route changes
    return () => {
      updateDuration();
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything
}