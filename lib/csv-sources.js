// lib/csv-sources.js
// 这些网址直接照抄自 index.html 本身用的 CSV 发布连结
// 好处：跟 dashboard 显示的数字保证一致，不受 xlsx/Office 格式限制，不需要 Google API 权限

const SALES_CSV = {
  7:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIp2-3a8bPsfMTb45nguW_9ZAyXsc8P0mjWfbMjZJ_A7xbuNQkzSD1eG4lYiSq5g/pub?gid=137455480&single=true&output=csv",
  8:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIp2-3a8bPsfMTb45nguW_9ZAyXsc8P0mjWfbMjZJ_A7xbuNQkzSD1eG4lYiSq5g/pub?gid=1315121093&single=true&output=csv",
  9:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIp2-3a8bPsfMTb45nguW_9ZAyXsc8P0mjWfbMjZJ_A7xbuNQkzSD1eG4lYiSq5g/pub?gid=859475979&single=true&output=csv",
  10: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIp2-3a8bPsfMTb45nguW_9ZAyXsc8P0mjWfbMjZJ_A7xbuNQkzSD1eG4lYiSq5g/pub?gid=1245761165&single=true&output=csv",
  11: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIp2-3a8bPsfMTb45nguW_9ZAyXsc8P0mjWfbMjZJ_A7xbuNQkzSD1eG4lYiSq5g/pub?gid=102861271&single=true&output=csv",
  12: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIp2-3a8bPsfMTb45nguW_9ZAyXsc8P0mjWfbMjZJ_A7xbuNQkzSD1eG4lYiSq5g/pub?gid=308342362&single=true&output=csv",
};
const PETTY_CSV = {
  7:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vThF_nSmW2aiOhxeuEXRkJzXpt-J2gaAgFNibZcwv7nogNVhKI-aqgimvTkv-0cDQ/pub?gid=602166538&single=true&output=csv",
  8:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vThF_nSmW2aiOhxeuEXRkJzXpt-J2gaAgFNibZcwv7nogNVhKI-aqgimvTkv-0cDQ/pub?gid=1008242277&single=true&output=csv",
  9:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vThF_nSmW2aiOhxeuEXRkJzXpt-J2gaAgFNibZcwv7nogNVhKI-aqgimvTkv-0cDQ/pub?gid=950920463&single=true&output=csv",
  10: "https://docs.google.com/spreadsheets/d/e/2PACX-1vThF_nSmW2aiOhxeuEXRkJzXpt-J2gaAgFNibZcwv7nogNVhKI-aqgimvTkv-0cDQ/pub?gid=1282413314&single=true&output=csv",
  11: "https://docs.google.com/spreadsheets/d/e/2PACX-1vThF_nSmW2aiOhxeuEXRkJzXpt-J2gaAgFNibZcwv7nogNVhKI-aqgimvTkv-0cDQ/pub?gid=1955453308&single=true&output=csv",
  12: "https://docs.google.com/spreadsheets/d/e/2PACX-1vThF_nSmW2aiOhxeuEXRkJzXpt-J2gaAgFNibZcwv7nogNVhKI-aqgimvTkv-0cDQ/pub?gid=188416129&single=true&output=csv",
};
const REMIT_CSV = { // 你叫它"门市现金业绩"，程式码里叫 remit（业绩现金汇款）
  7:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPxIho35KRCuXSgZes5btH2RepFfu5NLPAs0d-kNPeC9f9YD6C4ONJU1QsZyELhw/pub?gid=846884846&single=true&output=csv",
  8:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPxIho35KRCuXSgZes5btH2RepFfu5NLPAs0d-kNPeC9f9YD6C4ONJU1QsZyELhw/pub?gid=2127980298&single=true&output=csv",
  9:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPxIho35KRCuXSgZes5btH2RepFfu5NLPAs0d-kNPeC9f9YD6C4ONJU1QsZyELhw/pub?gid=2142344994&single=true&output=csv",
  10: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPxIho35KRCuXSgZes5btH2RepFfu5NLPAs0d-kNPeC9f9YD6C4ONJU1QsZyELhw/pub?gid=517581472&single=true&output=csv",
  11: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPxIho35KRCuXSgZes5btH2RepFfu5NLPAs0d-kNPeC9f9YD6C4ONJU1QsZyELhw/pub?gid=21986860&single=true&output=csv",
  12: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPxIho35KRCuXSgZes5btH2RepFfu5NLPAs0d-kNPeC9f9YD6C4ONJU1QsZyELhw/pub?gid=1392389840&single=true&output=csv",
};
const REVIEW_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVXf4EiZfb-qmbqqo9O1JZikG2ZMbFkOqUk3aNm_OCzq797kC2zbPoFYSZAkgrYA/pub?gid=1582303184&single=true&output=csv";
const FOODCOST_CSV = {
  7:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Yl3JFGckAxj-HZYd44ApuSersnKWQXcCpKaHCjLSJcZ7qhelHRmQb1EcNZc1NA/pub?gid=668388263&single=true&output=csv",
  8:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Yl3JFGckAxj-HZYd44ApuSersnKWQXcCpKaHCjLSJcZ7qhelHRmQb1EcNZc1NA/pub?gid=508612396&single=true&output=csv",
  9:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Yl3JFGckAxj-HZYd44ApuSersnKWQXcCpKaHCjLSJcZ7qhelHRmQb1EcNZc1NA/pub?gid=103081336&single=true&output=csv",
  10: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Yl3JFGckAxj-HZYd44ApuSersnKWQXcCpKaHCjLSJcZ7qhelHRmQb1EcNZc1NA/pub?gid=1905050590&single=true&output=csv",
  11: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Yl3JFGckAxj-HZYd44ApuSersnKWQXcCpKaHCjLSJcZ7qhelHRmQb1EcNZc1NA/pub?gid=606232206&single=true&output=csv",
  12: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Yl3JFGckAxj-HZYd44ApuSersnKWQXcCpKaHCjLSJcZ7qhelHRmQb1EcNZc1NA/pub?gid=1809472423&single=true&output=csv",
};

module.exports = { SALES_CSV, PETTY_CSV, REMIT_CSV, REVIEW_CSV, FOODCOST_CSV };
