package model

// LifeCircle 生活圈
type LifeCircle struct {
	ID                 int64   `json:"id" gorm:"primaryKey"`
	Name               string  `json:"name" gorm:"size:100;not null"`        // 生活圈名称
	AnchorMetroStation string  `json:"anchor_metro_station" gorm:"size:50"`  // 锚定地铁站
	Boundary           string  `json:"boundary" gorm:"type:text"`            // 边界 polygon
	CoverageRadius     int     `json:"coverage_radius"`                      // 覆盖半径 米
	BlockID            int64   `json:"block_id" gorm:"index"`
	DistrictID         int64   `json:"district_id" gorm:"index"`
	MetroLinesCount    int     `json:"metro_lines_count"`                   // 线路数
	PeakHourInterval   int     `json:"peak_hour_interval"`                  // 早高峰间隔
	FirstTrainTime     string  `json:"first_train_time" gorm:"size:10"`      // 首班车
	LastTrainTime      string  `json:"last_train_time" gorm:"size:10"`       // 末班车
	DailyPassengerVolume int   `json:"daily_passenger_volume"`              // 日均客流
	StationFacilities  string  `json:"station_facilities" gorm:"type:text"`  // 站内设施 JSON
	CommuteToWork      string  `json:"commute_to_work" gorm:"type:text"`    // 通勤耗时 JSON
	Kindergartens      string  `json:"kindergartens" gorm:"type:text"`       // 幼儿园 JSON
	PrimarySchools     string  `json:"primary_schools" gorm:"type:text"`     // 小学 JSON
	MiddleSchools      string  `json:"middle_schools" gorm:"type:text"`      // 中学 JSON
	ShoppingMalls      string  `json:"shopping_malls" gorm:"type:text"`      // 商场 JSON
	ConvStoresDensity  float64 `json:"conv_stores_density"`                // 便利店密度
	RestaurantsDensity float64 `json:"restaurants_density"`                // 餐饮密度
	CommunityHealthCntr string `json:"community_health_center" gorm:"type:text"` // 社康中心
	PharmacyDensity    float64 `json:"pharmacy_density"`                   // 药店密度
	TopHospitalAccess  string  `json:"top_hospital_accessible" gorm:"type:text"` // 三甲医院
	ParkCoverage       float64 `json:"park_coverage"`                     // 公园覆盖率
	NoiseSources       string  `json:"noise_sources" gorm:"type:text"`     // 噪音源
	FloodingRisk       bool    `json:"flooding_risk"`                      // 内涝风险
	AdverseFactors     string  `json:"adverse_factors" gorm:"type:text"`   // 不利因素
	BuildingAgeDist    string  `json:"building_age_distribution" gorm:"type:text"` // 楼龄分布
	QualityPropertyRatio float64 `json:"quality_property_ratio"`          // 品牌物业占比
	AvgRent            float64 `json:"avg_rent"`                          // 平均租金
	OnSaleInventory    int     `json:"on_sale_inventory"`                // 在售库存
	MonthlyDeals       int     `json:"monthly_deals"`                    // 月成交

	// 关联
	District    *District    `json:"district,omitempty" gorm:"foreignKey:DistrictID"`
	Block       *Block        `json:"block,omitempty" gorm:"foreignKey:BlockID"`
	Communities []Community  `json:"communities,omitempty" gorm:"foreignKey:LifeCircleID"`
}

// TableName 返回表名
func (LifeCircle) TableName() string {
	return "life_circles"
}
