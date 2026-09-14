import type {
  Language,
} from "@/types";

interface ProductAnalyticsMessages {
  loading: string;
  loadError: string;
  fallbackProduct: string;

  page: {
    title: string;
    subtitle: string;
    refresh: string;
    refreshing: string;
    days: (
      value: number
    ) => string;
  };

  period: {
    last7: string;
    last30: string;
    last90: string;
    timezone: string;
  };

  metrics: {
    unitsSold: string;
    unitsSoldSubtitle: string;

    revenue: string;
    revenueSubtitle: string;

    orders: string;
    ordersSubtitle: string;

    productsSold: string;
    productsSoldSubtitle: string;

    unitsPerOrder: string;
    unitsPerOrderSubtitle: string;

    dailyAverage: string;
    dailyAverageSubtitle: string;
  };

  chart: {
    title: string;
    subtitle: string;
    units: string;
    revenue: string;
    unitsSold: string;
  };

  leader: {
    title: string;
    subtitle: string;
    unitsSold: string;
    revenueGenerated: string;
    empty: string;
  };

  ranking: {
    title: string;
    subtitle: string;
    empty: string;
    position: string;
    product: string;
    units: string;
    orders: string;
    averagePrice: string;
    revenue: string;
  };

  daily: {
    title: string;
    subtitle: string;
    date: string;
    units: string;
    orders: string;
    revenue: string;
  };
}

export const ADMIN_PRODUCT_ANALYTICS_MESSAGES: Record<
  Language,
  ProductAnalyticsMessages
> = {
  es: {
    loading:
      "Cargando analíticas de productos...",
    loadError:
      "No se pudieron cargar las analíticas de productos.",
    fallbackProduct:
      "Producto",

    page: {
      title:
        "Analíticas de productos",
      subtitle:
        "Analiza qué productos se venden más y cuánto aportan a la facturación del establecimiento.",
      refresh:
        "Actualizar",
      refreshing:
        "Actualizando...",
      days: (
        value
      ) =>
        `${value} días`,
    },

    period: {
      last7:
        "Últimos 7 días",
      last30:
        "Últimos 30 días",
      last90:
        "Últimos 90 días",
      timezone:
        "Zona horaria",
    },

    metrics: {
      unitsSold:
        "Unidades vendidas",
      unitsSoldSubtitle:
        "Unidades de pedidos no cancelados",

      revenue:
        "Facturación",
      revenueSubtitle:
        "Importe generado por los productos",

      orders:
        "Pedidos",
      ordersSubtitle:
        "Pedidos únicos con productos vendidos",

      productsSold:
        "Productos vendidos",
      productsSoldSubtitle:
        "Productos distintos con al menos una venta",

      unitsPerOrder:
        "Unidades por pedido",
      unitsPerOrderSubtitle:
        "Promedio de unidades por pedido",

      dailyAverage:
        "Media diaria",
      dailyAverageSubtitle:
        "Unidades vendidas de media cada día",
    },

    chart: {
      title:
        "Evolución de productos",
      subtitle:
        "Unidades vendidas y facturación generada durante el período seleccionado.",
      units:
        "Unidades",
      revenue:
        "Facturación",
      unitsSold:
        "Unidades vendidas",
    },

    leader: {
      title:
        "Producto líder",
      subtitle:
        "Producto con más unidades vendidas.",
      unitsSold:
        "unidades vendidas",
      revenueGenerated:
        "Facturación generada",
      empty:
        "Todavía no existen ventas de productos en este período.",
    },

    ranking: {
      title:
        "Ranking de productos",
      subtitle:
        "Clasificación por unidades vendidas durante el período seleccionado.",
      empty:
        "Todavía no existen datos suficientes para generar el ranking.",
      position:
        "Posición",
      product:
        "Producto",
      units:
        "Unidades",
      orders:
        "Pedidos",
      averagePrice:
        "Precio medio",
      revenue:
        "Facturación",
    },

    daily: {
      title:
        "Detalle diario",
      subtitle:
        "Evolución diaria de unidades, pedidos y facturación de productos.",
      date:
        "Fecha",
      units:
        "Unidades",
      orders:
        "Pedidos",
      revenue:
        "Facturación",
    },
  },

  en: {
    loading:
      "Loading product analytics...",
    loadError:
      "Product analytics could not be loaded.",
    fallbackProduct:
      "Product",

    page: {
      title:
        "Product analytics",
      subtitle:
        "Analyse which products sell the most and how much revenue they generate.",
      refresh:
        "Refresh",
      refreshing:
        "Refreshing...",
      days: (
        value
      ) =>
        `${value} days`,
    },

    period: {
      last7:
        "Last 7 days",
      last30:
        "Last 30 days",
      last90:
        "Last 90 days",
      timezone:
        "Time zone",
    },

    metrics: {
      unitsSold:
        "Units sold",
      unitsSoldSubtitle:
        "Units from non-cancelled orders",

      revenue:
        "Revenue",
      revenueSubtitle:
        "Amount generated by products",

      orders:
        "Orders",
      ordersSubtitle:
        "Unique orders containing sold products",

      productsSold:
        "Products sold",
      productsSoldSubtitle:
        "Distinct products with at least one sale",

      unitsPerOrder:
        "Units per order",
      unitsPerOrderSubtitle:
        "Average units per order",

      dailyAverage:
        "Daily average",
      dailyAverageSubtitle:
        "Average units sold per day",
    },

    chart: {
      title:
        "Product trend",
      subtitle:
        "Units sold and revenue generated during the selected period.",
      units:
        "Units",
      revenue:
        "Revenue",
      unitsSold:
        "Units sold",
    },

    leader: {
      title:
        "Top product",
      subtitle:
        "Product with the highest number of units sold.",
      unitsSold:
        "units sold",
      revenueGenerated:
        "Revenue generated",
      empty:
        "There are no product sales in this period yet.",
    },

    ranking: {
      title:
        "Product ranking",
      subtitle:
        "Ranking by units sold during the selected period.",
      empty:
        "There is not enough data yet to generate the ranking.",
      position:
        "Position",
      product:
        "Product",
      units:
        "Units",
      orders:
        "Orders",
      averagePrice:
        "Average price",
      revenue:
        "Revenue",
    },

    daily: {
      title:
        "Daily details",
      subtitle:
        "Daily trend of product units, orders and revenue.",
      date:
        "Date",
      units:
        "Units",
      orders:
        "Orders",
      revenue:
        "Revenue",
    },
  },

  de: {
    loading:
      "Produktanalysen werden geladen...",
    loadError:
      "Die Produktanalysen konnten nicht geladen werden.",
    fallbackProduct:
      "Produkt",

    page: {
      title:
        "Produktanalysen",
      subtitle:
        "Analysieren Sie, welche Produkte sich am besten verkaufen und wie viel Umsatz sie erzielen.",
      refresh:
        "Aktualisieren",
      refreshing:
        "Wird aktualisiert...",
      days: (
        value
      ) =>
        `${value} Tage`,
    },

    period: {
      last7:
        "Letzte 7 Tage",
      last30:
        "Letzte 30 Tage",
      last90:
        "Letzte 90 Tage",
      timezone:
        "Zeitzone",
    },

    metrics: {
      unitsSold:
        "Verkaufte Einheiten",
      unitsSoldSubtitle:
        "Einheiten aus nicht stornierten Bestellungen",

      revenue:
        "Umsatz",
      revenueSubtitle:
        "Durch Produkte erzielter Betrag",

      orders:
        "Bestellungen",
      ordersSubtitle:
        "Eindeutige Bestellungen mit verkauften Produkten",

      productsSold:
        "Verkaufte Produkte",
      productsSoldSubtitle:
        "Unterschiedliche Produkte mit mindestens einem Verkauf",

      unitsPerOrder:
        "Einheiten pro Bestellung",
      unitsPerOrderSubtitle:
        "Durchschnittliche Einheiten pro Bestellung",

      dailyAverage:
        "Tagesdurchschnitt",
      dailyAverageSubtitle:
        "Durchschnittlich verkaufte Einheiten pro Tag",
    },

    chart: {
      title:
        "Produktentwicklung",
      subtitle:
        "Verkaufte Einheiten und erzielter Umsatz im ausgewählten Zeitraum.",
      units:
        "Einheiten",
      revenue:
        "Umsatz",
      unitsSold:
        "Verkaufte Einheiten",
    },

    leader: {
      title:
        "Top-Produkt",
      subtitle:
        "Produkt mit den meisten verkauften Einheiten.",
      unitsSold:
        "verkaufte Einheiten",
      revenueGenerated:
        "Erzielter Umsatz",
      empty:
        "In diesem Zeitraum gibt es noch keine Produktverkäufe.",
    },

    ranking: {
      title:
        "Produktranking",
      subtitle:
        "Rangliste nach verkauften Einheiten im ausgewählten Zeitraum.",
      empty:
        "Es liegen noch nicht genügend Daten für ein Ranking vor.",
      position:
        "Position",
      product:
        "Produkt",
      units:
        "Einheiten",
      orders:
        "Bestellungen",
      averagePrice:
        "Durchschnittspreis",
      revenue:
        "Umsatz",
    },

    daily: {
      title:
        "Tagesdetails",
      subtitle:
        "Tägliche Entwicklung von Einheiten, Bestellungen und Produktumsatz.",
      date:
        "Datum",
      units:
        "Einheiten",
      orders:
        "Bestellungen",
      revenue:
        "Umsatz",
    },
  },

  fr: {
    loading:
      "Chargement des analyses de produits...",
    loadError:
      "Impossible de charger les analyses de produits.",
    fallbackProduct:
      "Produit",

    page: {
      title:
        "Analyse des produits",
      subtitle:
        "Analysez les produits les plus vendus et leur contribution au chiffre d’affaires.",
      refresh:
        "Actualiser",
      refreshing:
        "Actualisation...",
      days: (
        value
      ) =>
        `${value} jours`,
    },

    period: {
      last7:
        "7 derniers jours",
      last30:
        "30 derniers jours",
      last90:
        "90 derniers jours",
      timezone:
        "Fuseau horaire",
    },

    metrics: {
      unitsSold:
        "Unités vendues",
      unitsSoldSubtitle:
        "Unités issues de commandes non annulées",

      revenue:
        "Chiffre d’affaires",
      revenueSubtitle:
        "Montant généré par les produits",

      orders:
        "Commandes",
      ordersSubtitle:
        "Commandes uniques contenant des produits vendus",

      productsSold:
        "Produits vendus",
      productsSoldSubtitle:
        "Produits distincts ayant au moins une vente",

      unitsPerOrder:
        "Unités par commande",
      unitsPerOrderSubtitle:
        "Nombre moyen d’unités par commande",

      dailyAverage:
        "Moyenne quotidienne",
      dailyAverageSubtitle:
        "Nombre moyen d’unités vendues par jour",
    },

    chart: {
      title:
        "Évolution des produits",
      subtitle:
        "Unités vendues et chiffre d’affaires généré pendant la période sélectionnée.",
      units:
        "Unités",
      revenue:
        "Chiffre d’affaires",
      unitsSold:
        "Unités vendues",
    },

    leader: {
      title:
        "Produit leader",
      subtitle:
        "Produit ayant enregistré le plus grand nombre d’unités vendues.",
      unitsSold:
        "unités vendues",
      revenueGenerated:
        "Chiffre d’affaires généré",
      empty:
        "Aucune vente de produit n’a encore été enregistrée sur cette période.",
    },

    ranking: {
      title:
        "Classement des produits",
      subtitle:
        "Classement par unités vendues pendant la période sélectionnée.",
      empty:
        "Les données sont encore insuffisantes pour générer le classement.",
      position:
        "Position",
      product:
        "Produit",
      units:
        "Unités",
      orders:
        "Commandes",
      averagePrice:
        "Prix moyen",
      revenue:
        "Chiffre d’affaires",
    },

    daily: {
      title:
        "Détail quotidien",
      subtitle:
        "Évolution quotidienne des unités, commandes et ventes de produits.",
      date:
        "Date",
      units:
        "Unités",
      orders:
        "Commandes",
      revenue:
        "Chiffre d’affaires",
    },
  },

  it: {
    loading:
      "Caricamento analisi prodotti...",
    loadError:
      "Impossibile caricare le analisi dei prodotti.",
    fallbackProduct:
      "Prodotto",

    page: {
      title:
        "Analisi dei prodotti",
      subtitle:
        "Analizza quali prodotti vendono di più e quanto contribuiscono al fatturato.",
      refresh:
        "Aggiorna",
      refreshing:
        "Aggiornamento...",
      days: (
        value
      ) =>
        `${value} giorni`,
    },

    period: {
      last7:
        "Ultimi 7 giorni",
      last30:
        "Ultimi 30 giorni",
      last90:
        "Ultimi 90 giorni",
      timezone:
        "Fuso orario",
    },

    metrics: {
      unitsSold:
        "Unità vendute",
      unitsSoldSubtitle:
        "Unità provenienti da ordini non annullati",

      revenue:
        "Fatturato",
      revenueSubtitle:
        "Importo generato dai prodotti",

      orders:
        "Ordini",
      ordersSubtitle:
        "Ordini unici con prodotti venduti",

      productsSold:
        "Prodotti venduti",
      productsSoldSubtitle:
        "Prodotti distinti con almeno una vendita",

      unitsPerOrder:
        "Unità per ordine",
      unitsPerOrderSubtitle:
        "Media delle unità per ordine",

      dailyAverage:
        "Media giornaliera",
      dailyAverageSubtitle:
        "Unità vendute in media ogni giorno",
    },

    chart: {
      title:
        "Andamento dei prodotti",
      subtitle:
        "Unità vendute e fatturato generato nel periodo selezionato.",
      units:
        "Unità",
      revenue:
        "Fatturato",
      unitsSold:
        "Unità vendute",
    },

    leader: {
      title:
        "Prodotto leader",
      subtitle:
        "Prodotto con il maggior numero di unità vendute.",
      unitsSold:
        "unità vendute",
      revenueGenerated:
        "Fatturato generato",
      empty:
        "Non ci sono ancora vendite di prodotti in questo periodo.",
    },

    ranking: {
      title:
        "Classifica prodotti",
      subtitle:
        "Classifica per unità vendute nel periodo selezionato.",
      empty:
        "Non ci sono ancora dati sufficienti per generare la classifica.",
      position:
        "Posizione",
      product:
        "Prodotto",
      units:
        "Unità",
      orders:
        "Ordini",
      averagePrice:
        "Prezzo medio",
      revenue:
        "Fatturato",
    },

    daily: {
      title:
        "Dettaglio giornaliero",
      subtitle:
        "Andamento giornaliero di unità, ordini e fatturato dei prodotti.",
      date:
        "Data",
      units:
        "Unità",
      orders:
        "Ordini",
      revenue:
        "Fatturato",
    },
  },

  pt: {
    loading:
      "A carregar análises de produtos...",
    loadError:
      "Não foi possível carregar as análises de produtos.",
    fallbackProduct:
      "Produto",

    page: {
      title:
        "Análises de produtos",
      subtitle:
        "Analise quais os produtos mais vendidos e quanto contribuem para a faturação.",
      refresh:
        "Atualizar",
      refreshing:
        "A atualizar...",
      days: (
        value
      ) =>
        `${value} dias`,
    },

    period: {
      last7:
        "Últimos 7 dias",
      last30:
        "Últimos 30 dias",
      last90:
        "Últimos 90 dias",
      timezone:
        "Fuso horário",
    },

    metrics: {
      unitsSold:
        "Unidades vendidas",
      unitsSoldSubtitle:
        "Unidades de pedidos não cancelados",

      revenue:
        "Faturação",
      revenueSubtitle:
        "Montante gerado pelos produtos",

      orders:
        "Pedidos",
      ordersSubtitle:
        "Pedidos únicos com produtos vendidos",

      productsSold:
        "Produtos vendidos",
      productsSoldSubtitle:
        "Produtos distintos com pelo menos uma venda",

      unitsPerOrder:
        "Unidades por pedido",
      unitsPerOrderSubtitle:
        "Média de unidades por pedido",

      dailyAverage:
        "Média diária",
      dailyAverageSubtitle:
        "Unidades vendidas em média por dia",
    },

    chart: {
      title:
        "Evolução dos produtos",
      subtitle:
        "Unidades vendidas e faturação gerada durante o período selecionado.",
      units:
        "Unidades",
      revenue:
        "Faturação",
      unitsSold:
        "Unidades vendidas",
    },

    leader: {
      title:
        "Produto líder",
      subtitle:
        "Produto com maior número de unidades vendidas.",
      unitsSold:
        "unidades vendidas",
      revenueGenerated:
        "Faturação gerada",
      empty:
        "Ainda não existem vendas de produtos neste período.",
    },

    ranking: {
      title:
        "Ranking de produtos",
      subtitle:
        "Classificação por unidades vendidas durante o período selecionado.",
      empty:
        "Ainda não existem dados suficientes para gerar o ranking.",
      position:
        "Posição",
      product:
        "Produto",
      units:
        "Unidades",
      orders:
        "Pedidos",
      averagePrice:
        "Preço médio",
      revenue:
        "Faturação",
    },

    daily: {
      title:
        "Detalhe diário",
      subtitle:
        "Evolução diária das unidades, pedidos e faturação dos produtos.",
      date:
        "Data",
      units:
        "Unidades",
      orders:
        "Pedidos",
      revenue:
        "Faturação",
    },
  },
};