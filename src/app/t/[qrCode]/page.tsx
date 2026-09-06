import {
  redirect,
} from "next/navigation";

interface PageProps {
  params: Promise<{
    qrCode: string;
  }>;
}

export default async function TableQrPage({
  params,
}: PageProps) {
  const {
    qrCode,
  } =
    await params;

  const normalizedQrCode =
    typeof qrCode ===
      "string"
      ? qrCode.trim()
      : "";

  if (
    !normalizedQrCode
  ) {
    redirect(
      "/"
    );
  }

  redirect(
    `/client/${encodeURIComponent(
      normalizedQrCode
    )}`
  );
}