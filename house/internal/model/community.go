package model

// Community 小区
type Community struct {
	ID            int64   `json:"id" gorm:"primaryKey"`
	Name          string  `json:"name" gorm:"size:100;not null"`        // 小区名称
	OfficialName  string  `json:"official_name" gorm:"size:100"`         // 备案名
	DistrictID    int64   `json:"district_id" gorm:"index"`
	BlockID       int64   `json:"block_id" gorm:"index"`
	LifeCircleID  int64   `json:"life_circle_id" gorm:"index"`
	Address       string  `json:"address" gorm:"size:200"`              // 详细地址
	Coordinates   string  `json:"coordinates" gorm:"size:50"`           // 坐标 lng,lat
	CompletionYear int    `json:"completion_year"`                      // 竣工年份
	BuildingAge   int     `json:"building_age"`                        // 楼龄
	TotalUnits    int     `json:"total_units"`                         // 总户数
	Developer     string  `json:"developer" gorm:"size:100"`           // 开发商
	PropertyComp  string  `json:"property_company" gorm:"size:100"`   // 物业公司
	PropertyFee   float64 `json:"property_fee"`                        // 物业费
	Positioning   string  `json:"positioning" gorm:"size:20"`          // 定位

	// 建筑信息
	LandArea       float64 `json:"land_area"`        // 占地面积 m²
	BuildingArea   float64 `json:"building_area"`    // 建筑面积 m²
	PlotRatio      float64 `json:"plot_ratio"`       // 容积率
	GreeningRate   float64 `json:"greening_rate"`    // 绿化率
	BuildingCount  int     `json:"building_count"`   // 栋数
	FloorCount     int     `json:"floor_count"`      // 层数
	ElevatorRatio  string  `json:"elevator_ratio"`   // 梯户比
	UnitAreaRatio  float64 `json:"unit_area_ratio"`  // 得房率
	OrientationDist string `json:"orientation_distribution" gorm:"type:text"` // 朝向分布

	// 停车位
	ParkingTotal   int     `json:"parking_total"`    // 总车位
	ParkingRatio   string  `json:"parking_ratio"`    // 车户比
	ParkingAbove   int     `json:"parking_above"`    // 地上
	ParkingBelow   int     `json:"parking_below"`    // 地下
	ParkingFeeMonthly float64 `json:"parking_fee_monthly"` // 月租
	ParkingFeeHourly  float64 `json:"parking_fee_hourly"`  // 临停

	// 交通
	NearestMetro    string `json:"nearest_metro" gorm:"type:text"`     // 最近地铁站
	BusLinesCount   int    `json:"bus_lines_count"`                   // 公交线路数

	// 户型
	UnitTypes      string `json:"unit_types" gorm:"type:text"`        // 户型种类
	MainUnitType   string `json:"main_unit_type"`                    // 主力户型
	AreaRange      string `json:"area_range" gorm:"type:text"`       // 面积段
	DecorationStatus string `json:"decoration_status" gorm:"size:10"` // 装修状况

	// 价格行情
	ListingPrice      float64 `json:"listing_price"`        // 挂牌价
	RecentDealPrice   float64 `json:"recent_deal_price"`   // 成交价
	PriceTrend        string  `json:"price_trend" gorm:"type:text"` // 历史走势
	AvgDaysOnMarket   int     `json:"avg_days_on_market"`  // 平均成交周期
	BargainingSpace   float64 `json:"bargaining_space"`    // 议价空间
	OnSaleCount       int     `json:"on_sale_count"`       // 在售
	OnRentCount       int     `json:"on_rent_count"`       // 在租
	RentLevel         string  `json:"rent_level" gorm:"type:text"` // 租金

	// 教育配套
	AssignedSchool string `json:"assigned_school" gorm:"type:text"` // 对口学校

	// 环境与安全
	GardenLandscape        string `json:"garden_landscape"`       // 园林景观
	NoiseSources          string `json:"noise_sources" gorm:"type:text"` // 噪音源
	PropertyMgmtLevel     string `json:"property_management_level" gorm:"size:10"`
	SecuritySystem       string `json:"security_system"`       // 安防系统
	PedestrianVehicleSep  bool   `json:"pedestrian_vehicle_separation"` // 人车分流
	ElevatorBrand        string `json:"elevator_brand"`        // 电梯品牌
	FloodingRisk         bool   `json:"flooding_risk"`         // 内涝风险

	// 不利因素
	AdverseFactors500m  string `json:"adverse_factors_500m" gorm:"type:text"`  // 500米内
	AdverseFactors1000m string `json:"adverse_factors_1000m" gorm:"type:text"` // 1000米内

	// 口碑
	Rating           float64 `json:"rating"`             // 评分
	LitigationHistory string `json:"litigation_history" gorm:"type:text"` // 维权记录
	NegativeNews     string `json:"negative_news" gorm:"type:text"`     // 负面新闻

	// 关联
	District   *District  `json:"district,omitempty" gorm:"foreignKey:DistrictID"`
	Block      *Block     `json:"block,omitempty" gorm:"foreignKey:BlockID"`
	LifeCircle *LifeCircle `json:"life_circle,omitempty" gorm:"foreignKey:LifeCircleID"`
}

// TableName 返回表名
func (Community) TableName() string {
	return "communities"
}
