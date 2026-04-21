package model

// Block 板块
type Block struct {
	ID                 int64   `json:"id" gorm:"primaryKey"`
	Name               string  `json:"name" gorm:"size:50;not null"` // 板块名称
	Alias              string  `json:"alias" gorm:"size:100"`        // 别名
	DistrictID         int64   `json:"district_id" gorm:"index"`
	Boundary           string  `json:"boundary" gorm:"type:text"`     // 边界坐标 JSON
	CenterLng          float64 `json:"center_lng"`                   // 中心经度
	CenterLat          float64 `json:"center_lat"`                   // 中心纬度
	FunctionType       string  `json:"function_type" gorm:"size:20"` // 功能定位
	Maturity           string  `json:"maturity" gorm:"size:20"`     // 建成度
	AvgPrice           float64 `json:"avg_price"`                   // 均价
	PriceChangeMonthly float64 `json:"price_change_monthly"`        // 环比涨幅
	PriceChangeYearly  float64 `json:"price_change_yearly"`         // 同比涨幅
	MonthlyDeals       int     `json:"monthly_deals"`               // 月度成交
	OnSaleCount        int     `json:"on_sale_count"`               // 在售
	RentLevel          float64 `json:"rent_level"`                  // 租金 元/㎡·月
	CommunityCount     int     `json:"community_count"`             // 小区数量
	NewCommunityRatio  float64 `json:"new_community_ratio"`        // 次新盘比例
	MetroLines         string  `json:"metro_lines" gorm:"type:text"` // 地铁线路 JSON 数组
	MetroDensity       float64 `json:"metro_density"`              // 站点密度
	PlanningPositioning string `json:"planning_positioning"`       // 法定图则定位
	FutureBenefits     string  `json:"future_benefits" gorm:"type:text"` // 规划利好 JSON 数组

	// 关联
	District     *District     `json:"district,omitempty" gorm:"foreignKey:DistrictID"`
	Communities  []Community   `json:"communities,omitempty" gorm:"foreignKey:BlockID"`
	LifeCircles  []LifeCircle  `json:"life_circles,omitempty" gorm:"foreignKey:BlockID"`
}

// TableName 返回表名
func (Block) TableName() string {
	return "blocks"
}