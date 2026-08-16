/**
 * Fund Catalogue — curated UK-platform funds/ETFs/investment trusts with a DEFAULT sub-class.
 * =============================================================================
 * These are SUGGESTIONS only: illustrative categorisations to a modelled sub-class
 * (see SubAssetModel.SUB_ASSET_PROFILES). The tagging UI lets the user override the
 * sub-class on any holding, and unknown tickers can be categorised manually. Not
 * financial advice; inclusion is not a recommendation.
 *
 * Maintained by hand (grouped below for readability); the EXPORT is sorted
 * alphabetically by ticker — the UI relies on that ordering. A Firestore admin
 * override (admin/fundCatalogue) can supersede this default list at runtime.
 *
 * Conventions: LSE tickers; acc/dist share classes listed separately where both are
 * common; ordinary operating companies are excluded (funds/trusts/ETFs only).
 */

const GROUPS = [
  // ---- Shares: world growth / trackers --------------------------------------
  [
    { ticker: 'ATST', name: 'Alliance Trust',                          subClass: 'worldGrowth' },
    { ticker: 'ATT',  name: 'Allianz Technology Trust',                subClass: 'worldGrowth' },
    { ticker: 'BGFD', name: 'Baillie Gifford Japan Trust',             subClass: 'worldGrowth' },
    { ticker: 'BNKR', name: 'Bankers Investment Trust',                subClass: 'worldGrowth' },
    { ticker: 'BUT',  name: 'Brunner Investment Trust',                subClass: 'worldGrowth' },
    { ticker: 'CLDN', name: 'Caledonia Investments',                   subClass: 'worldGrowth' },
    { ticker: 'CSP1', name: 'iShares Core S&P 500 (Acc)',              subClass: 'worldGrowth' },
    { ticker: 'CUKX', name: 'iShares Core FTSE 100 (Acc)',             subClass: 'ukEquityIncome' },
    { ticker: 'EQQQ', name: 'Invesco Nasdaq-100',                      subClass: 'worldGrowth' },
    { ticker: 'FCIT', name: 'F&C Investment Trust',                    subClass: 'worldGrowth' },
    { ticker: 'FWRA', name: 'Invesco FTSE All-World (Acc)',            subClass: 'worldGrowth' },
    { ticker: 'FWRG', name: 'Invesco FTSE All-World (Dist)',           subClass: 'worldGrowth' },
    { ticker: 'GSPX', name: 'iShares S&P 500 GBP-Hedged',              subClass: 'worldGrowth' },
    { ticker: 'HGT',  name: 'HgCapital Trust',                         subClass: 'worldGrowth' },
    { ticker: 'HMWO', name: 'HSBC MSCI World',                         subClass: 'worldGrowth' },
    { ticker: 'HVPE', name: 'HarbourVest Global Private Equity',       subClass: 'worldGrowth' },
    { ticker: 'IBT',  name: 'International Biotechnology Trust',       subClass: 'worldGrowth' },
    { ticker: 'IITU', name: 'iShares S&P 500 Information Technology',  subClass: 'worldGrowth' },
    { ticker: 'IMEU', name: 'iShares Core MSCI Europe',                subClass: 'worldGrowth' },
    { ticker: 'INRG', name: 'iShares Global Clean Energy',             subClass: 'worldGrowth' },
    { ticker: 'ISAC', name: 'iShares MSCI ACWI (Acc)',                 subClass: 'worldGrowth' },
    { ticker: 'IUHC', name: 'iShares S&P 500 Health Care',             subClass: 'worldGrowth' },
    { ticker: 'IUSA', name: 'iShares Core S&P 500 (Dist)',             subClass: 'worldGrowth' },
    { ticker: 'IWDA', name: 'iShares Core MSCI World (Acc, USD line)', subClass: 'worldGrowth' },
    { ticker: 'IWDG', name: 'iShares Core MSCI World GBP-Hedged',      subClass: 'worldGrowth' },
    { ticker: 'IJPN', name: 'iShares MSCI Japan',                      subClass: 'worldGrowth' },
    { ticker: 'JAM',  name: 'JPMorgan American Investment Trust',      subClass: 'worldGrowth' },
    { ticker: 'LCWL', name: 'Amundi (Lyxor) Core MSCI World',          subClass: 'worldGrowth' },
    { ticker: 'MNKS', name: 'Monks Investment Trust',                  subClass: 'worldGrowth' },
    { ticker: 'MWY',  name: 'Mid Wynd International',                  subClass: 'worldGrowth' },
    { ticker: 'PACW', name: 'Amundi Prime All Country World',          subClass: 'worldGrowth' },
    { ticker: 'PCT',  name: 'Polar Capital Technology Trust',          subClass: 'worldGrowth' },
    { ticker: 'PIN',  name: 'Pantheon International',                  subClass: 'worldGrowth' },
    { ticker: 'RCP',  name: 'RIT Capital Partners',                    subClass: 'worldGrowth' },
    { ticker: 'SJG',  name: 'Schroder Japan Trust',                    subClass: 'worldGrowth' },
    { ticker: 'SMT',  name: 'Scottish Mortgage Investment Trust',      subClass: 'worldGrowth' },
    { ticker: 'SSAC', name: 'iShares MSCI ACWI',                       subClass: 'worldGrowth' },
    { ticker: 'SWDA', name: 'iShares Core MSCI World',                 subClass: 'worldGrowth' },
    { ticker: 'SWLD', name: 'SPDR MSCI World',                         subClass: 'worldGrowth' },
    { ticker: 'VAPX', name: 'Vanguard FTSE Dev Asia Pacific ex-Japan', subClass: 'worldGrowth' },
    { ticker: 'VERX', name: 'Vanguard FTSE Developed Europe ex-UK',    subClass: 'worldGrowth' },
    { ticker: 'VEUR', name: 'Vanguard FTSE Developed Europe',          subClass: 'worldGrowth' },
    { ticker: 'VEVE', name: 'Vanguard FTSE Developed World (Dist)',    subClass: 'worldGrowth' },
    { ticker: 'VHVG', name: 'Vanguard FTSE Developed World (Acc)',     subClass: 'worldGrowth' },
    { ticker: 'VJPN', name: 'Vanguard FTSE Japan',                     subClass: 'worldGrowth' },
    { ticker: 'VNRT', name: 'Vanguard FTSE North America',             subClass: 'worldGrowth' },
    { ticker: 'VUAG', name: 'Vanguard S&P 500 (Acc)',                  subClass: 'worldGrowth' },
    { ticker: 'VUSA', name: 'Vanguard S&P 500 (Dist)',                 subClass: 'worldGrowth' },
    { ticker: 'VWRL', name: 'Vanguard FTSE All-World (Dist)',          subClass: 'worldGrowth' },
    { ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)',           subClass: 'worldGrowth' },
    { ticker: 'WTAN', name: 'Witan Investment Trust',                  subClass: 'worldGrowth' },
    { ticker: 'WWH',  name: 'Worldwide Healthcare Trust',              subClass: 'worldGrowth' },
  ],
  // ---- Shares: UK equity income (incl. UK trackers & income infrastructure) --
  [
    { ticker: '3IN',  name: '3i Infrastructure',                       subClass: 'ukEquityIncome' },
    { ticker: 'AEI',  name: 'abrdn Equity Income Trust',               subClass: 'ukEquityIncome' },
    { ticker: 'BBGI', name: 'BBGI Global Infrastructure',              subClass: 'ukEquityIncome' },
    { ticker: 'BSIF', name: 'Bluefield Solar Income Fund',             subClass: 'ukEquityIncome' },
    { ticker: 'CTY',  name: 'City of London Investment Trust',         subClass: 'ukEquityIncome' },
    { ticker: 'DIG',  name: 'Dunedin Income Growth',                   subClass: 'ukEquityIncome' },
    { ticker: 'EDIN', name: 'Edinburgh Investment Trust',              subClass: 'ukEquityIncome' },
    { ticker: 'FGT',  name: 'Finsbury Growth & Income Trust',          subClass: 'ukEquityIncome' },
    { ticker: 'FSFL', name: 'Foresight Solar Fund',                    subClass: 'ukEquityIncome' },
    { ticker: 'FTAL', name: 'SPDR FTSE UK All Share',                  subClass: 'ukEquityIncome' },
    { ticker: 'GRID', name: 'Gresham House Energy Storage',            subClass: 'ukEquityIncome' },
    { ticker: 'GSF',  name: 'Gore Street Energy Storage',              subClass: 'ukEquityIncome' },
    { ticker: 'HHI',  name: 'Henderson High Income Trust',             subClass: 'ukEquityIncome' },
    { ticker: 'HICL', name: 'HICL Infrastructure',                     subClass: 'ukEquityIncome' },
    { ticker: 'HUKX', name: 'HSBC FTSE 100',                           subClass: 'ukEquityIncome' },
    { ticker: 'INPP', name: 'International Public Partnerships',       subClass: 'ukEquityIncome' },
    { ticker: 'ISF',  name: 'iShares Core FTSE 100 (Dist)',            subClass: 'ukEquityIncome' },
    { ticker: 'IUKD', name: 'iShares UK Dividend',                     subClass: 'ukEquityIncome' },
    { ticker: 'JCH',  name: 'JPMorgan Claverhouse',                    subClass: 'ukEquityIncome' },
    { ticker: 'JLEN', name: 'JLEN Environmental Assets',               subClass: 'ukEquityIncome' },
    { ticker: 'LWDB', name: 'Law Debenture Corporation',               subClass: 'ukEquityIncome' },
    { ticker: 'MRCH', name: 'Merchants Trust',                         subClass: 'ukEquityIncome' },
    { ticker: 'MUT',  name: 'Murray Income Trust',                     subClass: 'ukEquityIncome' },
    { ticker: 'NESF', name: 'NextEnergy Solar Fund',                   subClass: 'ukEquityIncome' },
    { ticker: 'ORIT', name: 'Octopus Renewables Infrastructure',       subClass: 'ukEquityIncome' },
    { ticker: 'SEIT', name: 'SDCL Energy Efficiency Income',           subClass: 'ukEquityIncome' },
    { ticker: 'SHRS', name: 'Shires Income',                           subClass: 'ukEquityIncome' },
    { ticker: 'TIGT', name: 'Troy Income & Growth Trust',              subClass: 'ukEquityIncome' },
    { ticker: 'TMPL', name: 'Temple Bar Investment Trust',             subClass: 'ukEquityIncome' },
    { ticker: 'TRIG', name: 'The Renewables Infrastructure Group',     subClass: 'ukEquityIncome' },
    { ticker: 'UKDV', name: 'SPDR UK Dividend Aristocrats',            subClass: 'ukEquityIncome' },
    { ticker: 'UKW',  name: 'Greencoat UK Wind',                       subClass: 'ukEquityIncome' },
    { ticker: 'VMID', name: 'Vanguard FTSE 250',                       subClass: 'ukEquityIncome' },
    { ticker: 'VUKE', name: 'Vanguard FTSE 100',                       subClass: 'ukEquityIncome' },
  ],
  // ---- Shares: global equity income ----------------------------------------
  [
    { ticker: 'GBDV', name: 'SPDR Global Dividend Aristocrats',        subClass: 'globalEquityIncome' },
    { ticker: 'HFEL', name: 'Henderson Far East Income',               subClass: 'globalEquityIncome' },
    { ticker: 'IAPD', name: 'iShares Asia Pacific Dividend',           subClass: 'globalEquityIncome' },
    { ticker: 'IDVY', name: 'iShares Euro Dividend',                   subClass: 'globalEquityIncome' },
    { ticker: 'JGGI', name: 'JPMorgan Global Growth & Income',         subClass: 'globalEquityIncome' },
    { ticker: 'MYI',  name: 'Murray International Trust',              subClass: 'globalEquityIncome' },
    { ticker: 'SAIN', name: 'Scottish American Investment Co',         subClass: 'globalEquityIncome' },
    { ticker: 'STS',  name: 'STS Global Income & Growth (Troy)',       subClass: 'globalEquityIncome' },
    { ticker: 'USDV', name: 'SPDR US Dividend Aristocrats',            subClass: 'globalEquityIncome' },
    { ticker: 'VHYL', name: 'Vanguard FTSE All-World High Div Yield',  subClass: 'globalEquityIncome' },
  ],
  // ---- Shares: property / REITs (NEW category) ------------------------------
  [
    { ticker: 'BBOX', name: 'Tritax Big Box REIT',                     subClass: 'reit' },
    { ticker: 'BLND', name: 'British Land',                            subClass: 'reit' },
    { ticker: 'BYG',  name: 'Big Yellow Group',                        subClass: 'reit' },
    { ticker: 'DLN',  name: 'Derwent London',                          subClass: 'reit' },
    { ticker: 'IHR',  name: 'Impact Healthcare REIT',                  subClass: 'reit' },
    { ticker: 'IUKP', name: 'iShares UK Property',                     subClass: 'reit' },
    { ticker: 'IWDP', name: 'iShares Developed Markets Property Yield', subClass: 'reit' },
    { ticker: 'LAND', name: 'Land Securities (Landsec)',               subClass: 'reit' },
    { ticker: 'LMP',  name: 'LondonMetric Property',                   subClass: 'reit' },
    { ticker: 'PHP',  name: 'Primary Health Properties',               subClass: 'reit' },
    { ticker: 'SAFE', name: 'Safestore Holdings',                      subClass: 'reit' },
    { ticker: 'SGRO', name: 'Segro',                                   subClass: 'reit' },
    { ticker: 'SHED', name: 'Urban Logistics REIT',                    subClass: 'reit' },
    { ticker: 'SRE',  name: 'Sirius Real Estate',                      subClass: 'reit' },
    { ticker: 'SUPR', name: 'Supermarket Income REIT',                 subClass: 'reit' },
    { ticker: 'THRL', name: 'Target Healthcare REIT',                  subClass: 'reit' },
    { ticker: 'TRY',  name: 'TR Property Investment Trust',            subClass: 'reit' },
    { ticker: 'UTG',  name: 'Unite Group',                             subClass: 'reit' },
    { ticker: 'WHR',  name: 'Warehouse REIT',                          subClass: 'reit' },
  ],
  // ---- Shares: emerging markets (NEW category) ------------------------------
  [
    { ticker: 'AAS',  name: 'abrdn Asia Focus',                        subClass: 'emEquity' },
    { ticker: 'EMIM', name: 'iShares Core MSCI EM IMI',                subClass: 'emEquity' },
    { ticker: 'FCSS', name: 'Fidelity China Special Situations',       subClass: 'emEquity' },
    { ticker: 'FEML', name: 'Fidelity Emerging Markets Limited',       subClass: 'emEquity' },
    { ticker: 'HMEF', name: 'HSBC MSCI Emerging Markets',              subClass: 'emEquity' },
    { ticker: 'JII',  name: 'JPMorgan Indian Investment Trust',        subClass: 'emEquity' },
    { ticker: 'JMG',  name: 'JPMorgan Emerging Markets',               subClass: 'emEquity' },
    { ticker: 'SEMA', name: 'SPDR MSCI Emerging Markets',              subClass: 'emEquity' },
    { ticker: 'TEM',  name: 'Templeton Emerging Markets',              subClass: 'emEquity' },
    { ticker: 'VEIL', name: 'Vietnam Enterprise Investments',          subClass: 'emEquity' },
    { ticker: 'VFEG', name: 'Vanguard FTSE Emerging Markets (Acc)',    subClass: 'emEquity' },
    { ticker: 'VFEM', name: 'Vanguard FTSE Emerging Markets (Dist)',   subClass: 'emEquity' },
    { ticker: 'VOF',  name: 'VinaCapital Vietnam Opportunity',         subClass: 'emEquity' },
  ],
  // ---- Shares: global / UK smaller companies (NEW category) -----------------
  [
    { ticker: 'ASL',  name: 'Aberforth Smaller Companies',             subClass: 'globalSmallCap' },
    { ticker: 'BRSC', name: 'BlackRock Smaller Companies',             subClass: 'globalSmallCap' },
    { ticker: 'EWI',  name: 'Edinburgh Worldwide',                     subClass: 'globalSmallCap' },
    { ticker: 'HSL',  name: 'Henderson Smaller Companies',             subClass: 'globalSmallCap' },
    { ticker: 'ISP6', name: 'iShares S&P SmallCap 600',                subClass: 'globalSmallCap' },
    { ticker: 'MTU',  name: 'Montanaro UK Smaller Companies',          subClass: 'globalSmallCap' },
    { ticker: 'SSON', name: 'Smithson Investment Trust',               subClass: 'globalSmallCap' },
    { ticker: 'THRG', name: 'BlackRock Throgmorton Trust',             subClass: 'globalSmallCap' },
    { ticker: 'USSC', name: 'SPDR MSCI USA Small Cap Value Weighted',  subClass: 'globalSmallCap' },
    { ticker: 'WLDS', name: 'iShares MSCI World Small Cap',            subClass: 'globalSmallCap' },
    { ticker: 'WOSC', name: 'SPDR MSCI World Small Cap',               subClass: 'globalSmallCap' },
  ],
  // ---- Bonds ---------------------------------------------------------------
  [
    { ticker: 'AGBP', name: 'iShares Core Global Agg GBP-Hedged',      subClass: 'globalAggHedged' },
    { ticker: 'GLTL', name: 'SPDR Bloomberg 15+ Year Gilt',            subClass: 'longGilts' },
    { ticker: 'GLTS', name: 'SPDR Bloomberg 1-5 Year Gilt',            subClass: 'shortGilts' },
    { ticker: 'IBTL', name: 'iShares $ Treasury 20+yr',                subClass: 'usTreasHedged' },
    { ticker: 'IBTM', name: 'iShares $ Treasury 7-10yr',               subClass: 'usTreasHedged' },
    { ticker: 'IBTS', name: 'iShares $ Treasury 1-3yr',                subClass: 'usTreasHedged' },
    { ticker: 'IDTG', name: 'iShares $ Treasury 7-10yr GBP-Hedged',    subClass: 'usTreasHedged' },
    { ticker: 'IGLS', name: 'iShares UK Gilts 0-5yr',                  subClass: 'shortGilts' },
    { ticker: 'IGLT', name: 'iShares Core UK Gilts',                   subClass: 'longGilts' },
    { ticker: 'INXG', name: 'iShares £ Index-Linked Gilts',            subClass: 'indexLinked' },
    { ticker: 'IS15', name: 'iShares £ Corp Bond 0-5yr',               subClass: 'corporateIG' },
    { ticker: 'ITPS', name: 'iShares $ TIPS',                          subClass: 'indexLinked' },
    { ticker: 'SLXX', name: 'iShares Core £ Corp Bond',                subClass: 'corporateIG' },
    { ticker: 'TI5G', name: 'iShares $ TIPS 0-5 (GBP-Hedged)',         subClass: 'indexLinked' },
    { ticker: 'VAGP', name: 'Vanguard Global Aggregate (GBP-Hedged, Dist)', subClass: 'globalAggHedged' },
    { ticker: 'VAGS', name: 'Vanguard Global Aggregate (GBP-Hedged, Acc)',  subClass: 'globalAggHedged' },
    { ticker: 'VGOV', name: 'Vanguard UK Gilt',                        subClass: 'longGilts' },
    { ticker: 'VUTY', name: 'Vanguard USD Treasury Bond',              subClass: 'usTreasHedged' },
  ],
  // ---- Bonds: high-yield credit (NEW category) -------------------------------
  [
    { ticker: 'BIPS', name: 'Invesco Bond Income Plus',                subClass: 'highYield' },
    { ticker: 'GHYS', name: 'iShares Global High Yield GBP-Hedged',    subClass: 'highYield' },
    { ticker: 'IHYG', name: 'iShares € High Yield Corp Bond',          subClass: 'highYield' },
    { ticker: 'IHYU', name: 'iShares $ High Yield Corp Bond',          subClass: 'highYield' },
    { ticker: 'NCYF', name: 'CQS New City High Yield',                 subClass: 'highYield' },
  ],
  // ---- Bonds: infrastructure debt -------------------------------------------
  [
    { ticker: 'GCP',  name: 'GCP Infrastructure Investments',          subClass: 'infraDebt' },
    { ticker: 'SEQI', name: 'Sequoia Economic Infrastructure',         subClass: 'infraDebt' },
  ],
  // ---- Cash / money market ---------------------------------------------------
  [
    { ticker: 'CSH2', name: 'Amundi Smart Overnight Return',           subClass: 'moneyMarket' },
    { ticker: 'ERNS', name: 'iShares £ Ultrashort Bond',               subClass: 'moneyMarket' },
    { ticker: 'XSTR', name: 'Xtrackers II Sterling Overnight Rate',    subClass: 'moneyMarket' },
  ],
  // ---- Diversifiers: gold & precious -----------------------------------------
  [
    { ticker: 'PHAU', name: 'WisdomTree Physical Gold (USD)',          subClass: 'gold' },
    { ticker: 'PHGP', name: 'WisdomTree Physical Gold (GBP)',          subClass: 'gold' },
    { ticker: 'RMAU', name: 'Royal Mint Physical Gold',                subClass: 'gold' },
    { ticker: 'SGLD', name: 'Invesco Physical Gold',                   subClass: 'gold' },
    { ticker: 'SGLN', name: 'iShares Physical Gold',                   subClass: 'gold' },
  ],
  // ---- Diversifiers: trend / defensive multi-asset ---------------------------
  [
    { ticker: 'BHMG', name: 'BH Macro',                                subClass: 'trendMacro' },
    { ticker: 'CGT',  name: 'Capital Gearing Trust',                   subClass: 'trendMacro' },
    { ticker: 'PNL',  name: 'Personal Assets Trust',                   subClass: 'trendMacro' },
    { ticker: 'RICA', name: 'Ruffer Investment Company',               subClass: 'trendMacro' },
  ],
  // ---- Diversifiers: broad commodities (NEW category) ------------------------
  [
    { ticker: 'AIGC', name: 'WisdomTree Broad Commodities',            subClass: 'commodities' },
    { ticker: 'BRNT', name: 'WisdomTree Brent Crude Oil',              subClass: 'commodities' },
    { ticker: 'CMOD', name: 'Invesco Bloomberg Commodity',             subClass: 'commodities' },
    { ticker: 'COPA', name: 'WisdomTree Copper',                       subClass: 'commodities' },
    { ticker: 'CRUD', name: 'WisdomTree WTI Crude Oil',                subClass: 'commodities' },
    { ticker: 'PHSP', name: 'WisdomTree Physical Silver (GBP)',        subClass: 'commodities' },
    { ticker: 'WCOA', name: 'WisdomTree Enhanced Commodity (USD)',     subClass: 'commodities' },
  ],
];

/** The default catalogue, ALPHABETICAL by ticker (the UI depends on this ordering). */
export const DEFAULT_FUND_CATALOGUE = Object.freeze(
  GROUPS.flat().sort((a, b) => a.ticker.localeCompare(b.ticker))
);
