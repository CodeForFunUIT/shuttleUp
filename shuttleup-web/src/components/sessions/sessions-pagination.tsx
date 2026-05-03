"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface SessionsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SessionsPagination({ page, totalPages, onPageChange }: SessionsPaginationProps) {
  const t = useTranslations("SessionsPage");

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {t("pagination.prev")}
      </Button>

      <span className="text-sm text-muted-foreground tabular-nums px-3">
        {t("pagination.pageOf", { page, total: totalPages })}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="gap-1"
      >
        {t("pagination.next")}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
