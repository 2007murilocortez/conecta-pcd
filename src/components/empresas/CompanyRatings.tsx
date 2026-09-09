type CompanyRatingsProps = {
  ratingAvg: number | null;
  accessibilityRatingAvg: number | null;
  reviewCount: number;
};

export function CompanyRatings({
  ratingAvg,
  accessibilityRatingAvg,
  reviewCount,
}: CompanyRatingsProps) {
  if (reviewCount === 0) {
    return <p className="text-sm text-neutral-600">Ainda sem avaliações.</p>;
  }

  return (
    <p>
      Nota geral {ratingAvg?.toFixed(1)} · Acessibilidade{" "}
      {accessibilityRatingAvg?.toFixed(1)} · {reviewCount}{" "}
      {reviewCount === 1 ? "avaliação" : "avaliações"}
    </p>
  );
}
