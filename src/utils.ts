export function openSidebar() {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

export function closeSidebar() {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

/* A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 1 2 3 4 5 6 7 8 9 0 * 中 */
export const buildMember = [
  "Aread", "Badbf-海啸", "BINGUN", "D_d01pHin_N", "Fog9ing", "Guozi233", "JY", "Lancelot浚泰", "Moto", "MutiXiang",
  "Plum氯化铅", "Sathath", "Sqcz777", "T128ve29", "Weimouren", "XRH", "Zombie_CHEN", "Zyfl", "3000thth",
  "_pingyin_", "白狼", "八云铀柚子", "茶夜(已退出)", "澄空", "碳酸氢钠", "把随", "德芙Defter", "皇鱼", "缄默", "接舆",
  "拉菲(已退出)", "路哥", "没有南瓜的雪人", "猫少ℳ𝒶ℴ", "酸柠檬Serendipity", "我真的不是西风", "杨队", "一只石斧子",
  "直江三沢"
];

export const sponsor = [
  "Cyq", "Frazeli", "KENDERG", "Lyx721188", "Niu1119", "25689", "…", ".....................", "小安αwα", "长明",
  "红茶", "绝言", "一骑尘风", "有德无财青年", "卓记肠粉", "猪仔文"
];