export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

type FeatureItem = {
  title: string;
  text: string;
};

type AudienceItem = {
  title: string;
  text: string;
};

export type Dictionary = {
  metaTitle: string;
  metaDescription: string;
  nav: {
    features: string;
    vision: string;
    audience: string;
    ambassadors: string;
    earlyAccess: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: string[];
  };
  trust: {
    title: string;
    items: string[];
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    items: FeatureItem[];
  };
  vision: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    stats: string[];
  };
  audience: {
    eyebrow: string;
    title: string;
    description: string;
    items: AudienceItem[];
  };
  ambassadors: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
    primaryCta: string;
  };
  earlyAccess: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    form: {
      name: string;
      email: string;
      city: string;
      role: string;
      submit: string;
      submitting: string;
    };
    roles: {
      breeder: string;
      association_leader: string;
      federation_representative: string;
      veterinarian: string;
      enthusiast: string;
    };
    success: {
      badge: string;
      title: string;
      description: string;
      referralCodeLabel: string;
      shareLinkLabel: string;
      shareWhatsapp: string;
      shareX: string;
      shareTelegram: string;
      copyLinkLabel: string;
      backHome: string;
      viewLeaderboard: string;
    };
  };
  footer: {
    brand: string;
    text: string;
    rights: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  tr: {
    metaTitle: "CanaryTrack | Kanarya yetiştiriciliği için yeni nesil yönetim platformu",
    metaDescription:
      "Kanarya yetiştiricileri, dernekler ve federasyonlar için üretim, soy takibi, eşleşme ve operasyon yönetimini modernleştiren platform.",
    nav: {
      features: "Özellikler",
      vision: "Vizyon",
      audience: "Kimler için",
      ambassadors: "Elçiler",
      earlyAccess: "Erken Erişim",
    },
    hero: {
      badge: "Kanarya yetiştiriciliği için global vizyon",
      title: "Kanarya yetiştiriciliğini dijital çağ ile buluşturuyoruz.",
      subtitle:
        "CanaryTrack; üretim takibi, eşleşme yönetimi, soy analizi ve topluluk büyümesini tek platformda bir araya getirir.",
      primaryCta: "Erken erişime katıl",
      secondaryCta: "Vizyonu keşfet",
      highlights: [
        "Soy takibi ve akrabalık ağı",
        "Akıllı eşleşme ve risk uyarıları",
        "Üretim, satış ve gider yönetimi",
        "Yerelden globale ölçeklenebilir altyapı",
      ],
    },
    trust: {
      title: "Sahadaki gerçek ihtiyaçlar için tasarlandı",
      items: [
        "Yetiştiriciler",
        "Dernekler",
        "Federasyonlar",
        "Veterinerler",
        "Meraklı topluluklar",
      ],
    },
    features: {
      eyebrow: "Temel kabiliyetler",
      title: "Yetiştiricinin tüm operasyonu tek merkezde",
      description:
        "CanaryTrack; günlük operasyonlardan stratejik üretim kararlarına kadar geniş bir kapsama sahip olacak şekilde tasarlanıyor.",
      items: [
        {
          title: "Soy ve akrabalık takibi",
          text: "Kuşlar arası ilişki ağını gör, riskli eşleşmeleri erken fark et.",
        },
        {
          title: "Eşleşme ve üretim yönetimi",
          text: "Çiftleri planla, yavru geçmişini izle, üretim verimini ölç.",
        },
        {
          title: "Satış ve gider kontrolü",
          text: "Gelir-gider hareketlerini takip ederek üretim ekonomisini güçlendir.",
        },
        {
          title: "Dernek ve federasyon uyumu",
          text: "Bireysel yetiştiriciden kurumsal yapılara kadar ölçeklenebilir kullanım.",
        },
        {
          title: "Yuva ve kuluçka takibi",
          text: "Yumurta, yavru çıkımı ve bakım sürecini düzenli biçimde izle.",
        },
        {
          title: "Karar destek ekranları",
          text: "Veriye dayalı özetler ile daha bilinçli üretim kararları al.",
        },
      ],
    },
    vision: {
      eyebrow: "Uzun vadeli hedef",
      title: "Yerelden globale uzanan bir yetiştirici ekosistemi",
      paragraph1:
        "CanaryTrack yalnızca bir kayıt aracı değil; üretici, dernek ve federasyon seviyesinde veri standardı oluşturan güçlü bir dijital altyapı olmayı hedefler.",
      paragraph2:
        "Amaç; yetiştiricilik bilgisini daha görünür, daha ölçülebilir ve daha sürdürülebilir hale getirerek dünya çapında kullanılabilecek modern bir ekosistem kurmaktır.",
      stats: [
        "Tek platformda üretim ve soy yönetimi",
        "Riskli eşleşmeler için görünür uyarılar",
        "Büyüyen topluluk için referral ve leaderboard altyapısı",
        "Uluslararası genişlemeye uygun mimari yaklaşım",
      ],
    },
    audience: {
      eyebrow: "Kimler için",
      title: "Sahadaki tüm paydaşlar için tasarlandı",
      description:
        "İlk günden itibaren farklı kullanıcı tiplerinin ihtiyaçlarına göre şekillenen bir yapı kuruyoruz.",
      items: [
        {
          title: "Yetiştiriciler",
          text: "Kuşlarını, eşleşmelerini, yavrularını ve satışlarını tek yerden yöneten profesyonel deneyim.",
        },
        {
          title: "Dernek yöneticileri",
          text: "Üye ilişkileri, organizasyon süreçleri ve kayıt düzeni için güçlü altyapı.",
        },
        {
          title: "Federasyon temsilcileri",
          text: "Daha büyük ölçekte görünürlük, veri standardı ve koordinasyon imkânı.",
        },
        {
          title: "Veterinerler",
          text: "Soy geçmişi ve yetiştirme bağlamı sayesinde daha anlamlı değerlendirme zemini.",
        },
        {
          title: "Meraklılar",
          text: "Kanarya dünyasına daha düzenli, öğretici ve modern bir giriş kapısı.",
        },
      ],
    },
    ambassadors: {
      eyebrow: "Topluluk büyümesi",
      title: "İlk destekçiler CanaryTrack’in yönünü belirleyecek",
      description:
        "Erken erişime katılan kullanıcılar, ürün gelişimine daha yakından katkı sağlayacak ve topluluk içinde görünür avantaj elde edecek.",
      points: [
        "Referral sistemi ile daha fazla kişiyi davet et",
        "Leaderboard üzerinde görünürlük kazan",
        "Ürünün gelişim yönünü erken dönemde etkile",
        "Topluluk içinde öncelikli konum elde et",
      ],
      primaryCta: "Erken erişim listesine gir",
    },
    earlyAccess: {
      eyebrow: "Erken erişim",
      title: "İlk kullanıcılar arasında yerini al",
      description:
        "CanaryTrack’in ilk kullanıcı topluluğuna katıl, gelişim sürecini yakından takip et ve platform büyürken avantaj kazan.",
      note: "Kayıt olduktan sonra sana özel referral kodun oluşturulur ve paylaşım ekranına yönlendirilirsin.",
      form: {
        name: "Ad soyad",
        email: "E-posta adresi",
        city: "Şehir",
        role: "Rol",
        submit: "Erken erişime katıl",
        submitting: "Gönderiliyor...",
      },
      roles: {
        breeder: "Yetiştirici",
        association_leader: "Dernek yöneticisi",
        federation_representative: "Federasyon temsilcisi",
        veterinarian: "Veteriner",
        enthusiast: "Meraklı",
      },
      success: {
        badge: "Kayıt tamamlandı",
        title: "Erken erişim kaydın başarıyla alındı",
        description:
          "Referral kodunu paylaşarak daha fazla kişiyi CanaryTrack ile tanıştırabilir ve sıralamada öne geçebilirsin.",
        referralCodeLabel: "Referral kodun",
        shareLinkLabel: "Paylaşım linkin",
        shareWhatsapp: "WhatsApp ile paylaş",
        shareX: "X üzerinde paylaş",
        shareTelegram: "Telegram ile paylaş",
        copyLinkLabel: "Linki kopyalamak için aşağıdan al",
        backHome: "Ana sayfaya dön",
        viewLeaderboard: "Leaderboard'u gör",
      },
    },
    footer: {
      brand: "CanaryTrack",
      text: "Kanarya yetiştiriciliği için veri odaklı yeni nesil platform.",
      rights: "© 2026 Tüm hakları saklıdır.",
    },
  },
  en: {
    metaTitle: "CanaryTrack | A new generation management platform for canary breeding",
    metaDescription:
      "A modern platform for breeders, associations, and federations to manage production, lineage, pairing, and operations in one place.",
    nav: {
      features: "Features",
      vision: "Vision",
      audience: "Audience",
      ambassadors: "Ambassadors",
      earlyAccess: "Early Access",
    },
    hero: {
      badge: "A global vision for canary breeding",
      title: "We are bringing canary breeding into the digital age.",
      subtitle:
        "CanaryTrack brings production tracking, pairing management, pedigree analysis, and community growth together in a single platform.",
      primaryCta: "Join early access",
      secondaryCta: "Discover the vision",
      highlights: [
        "Pedigree tracking and kinship network",
        "Smart pairing and risk warnings",
        "Production, sales, and expense management",
        "Scalable infrastructure from local to global",
      ],
    },
    trust: {
      title: "Designed for real needs in the field",
      items: [
        "Breeders",
        "Associations",
        "Federations",
        "Veterinarians",
        "Enthusiast communities",
      ],
    },
    features: {
      eyebrow: "Core capabilities",
      title: "The breeder’s full operation in one place",
      description:
        "CanaryTrack is being designed to cover everything from daily operations to strategic production decisions.",
      items: [
        {
          title: "Pedigree and kinship tracking",
          text: "Visualize relationship networks and detect risky pairings early.",
        },
        {
          title: "Pairing and production management",
          text: "Plan pairs, monitor chick history, and measure breeding efficiency.",
        },
        {
          title: "Sales and expense control",
          text: "Track income and expenses to strengthen breeding economics.",
        },
        {
          title: "Association and federation compatibility",
          text: "Scalable usage from individual breeders to institutional structures.",
        },
        {
          title: "Nest and incubation tracking",
          text: "Follow eggs, hatchings, and care processes in an organized way.",
        },
        {
          title: "Decision support views",
          text: "Make better breeding decisions with data-driven summaries.",
        },
      ],
    },
    vision: {
      eyebrow: "Long-term vision",
      title: "A breeder ecosystem that grows from local to global",
      paragraph1:
        "CanaryTrack is not only a record-keeping tool; it aims to become a strong digital infrastructure that establishes data standards for breeders, associations, and federations.",
      paragraph2:
        "The goal is to make breeding knowledge more visible, measurable, and sustainable while building a modern ecosystem that can be used internationally.",
      stats: [
        "Production and pedigree management in one platform",
        "Visible warnings for risky pairings",
        "Referral and leaderboard infrastructure for community growth",
        "Architecture ready for international expansion",
      ],
    },
    audience: {
      eyebrow: "Who it is for",
      title: "Designed for every stakeholder in the field",
      description:
        "From day one, we are building around the needs of different user types.",
      items: [
        {
          title: "Breeders",
          text: "A professional experience to manage birds, pairings, chicks, and sales from one place.",
        },
        {
          title: "Association leaders",
          text: "A strong foundation for member relationships, organization workflows, and structured records.",
        },
        {
          title: "Federation representatives",
          text: "Better visibility, data standards, and coordination at larger scale.",
        },
        {
          title: "Veterinarians",
          text: "A more meaningful evaluation context with pedigree history and breeding background.",
        },
        {
          title: "Enthusiasts",
          text: "A more organized, educational, and modern entry point into the world of canaries.",
        },
      ],
    },
    ambassadors: {
      eyebrow: "Community growth",
      title: "Early supporters will help shape CanaryTrack",
      description:
        "Users who join early access will contribute more closely to product development and gain visible advantages within the community.",
      points: [
        "Invite more people through the referral system",
        "Gain visibility on the leaderboard",
        "Influence the product direction early",
        "Earn a priority position inside the community",
      ],
      primaryCta: "Join the early access list",
    },
    earlyAccess: {
      eyebrow: "Early access",
      title: "Take your place among the first users",
      description:
        "Join the first CanaryTrack user community, follow the product closely, and gain advantages as the platform grows.",
      note: "After registering, your personal referral code will be created and you will be redirected to the share screen.",
      form: {
        name: "Full name",
        email: "Email address",
        city: "City",
        role: "Role",
        submit: "Join early access",
        submitting: "Submitting...",
      },
      roles: {
        breeder: "Breeder",
        association_leader: "Association leader",
        federation_representative: "Federation representative",
        veterinarian: "Veterinarian",
        enthusiast: "Enthusiast",
      },
      success: {
        badge: "Registration completed",
        title: "Your early access registration was received successfully",
        description:
          "Share your referral code to invite more people to CanaryTrack and move up the leaderboard.",
        referralCodeLabel: "Your referral code",
        shareLinkLabel: "Your share link",
        shareWhatsapp: "Share on WhatsApp",
        shareX: "Share on X",
        shareTelegram: "Share on Telegram",
        copyLinkLabel: "Copy your link from below",
        backHome: "Back to homepage",
        viewLeaderboard: "View leaderboard",
      },
    },
    footer: {
      brand: "CanaryTrack",
      text: "A data-driven new generation platform for canary breeding.",
      rights: "© 2026 All rights reserved.",
    },
  },
};