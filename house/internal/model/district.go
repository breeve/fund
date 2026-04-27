package model

// District 行政区
type District struct {
	ID           int64   `json:"id" gorm:"primaryKey"`
	Code         string  `json:"code" gorm:"uniqueIndex;size:20;not null"` // 区划代码，如 440305
	Name         string  `json:"name" gorm:"size:50;not null"`             // 行政区名称
	Area         float64 `json:"area" gorm:"type:float"`                   // 面积 km²
	Population   int64   `json:"population"`                               // 常住人口
	GDP          float64 `json:"gdp"`                                      // GDP 亿元
	Boundary     string  `json:"boundary" gorm:"type:text"`                // 边界坐标 JSON
	AvgPrice     float64 `json:"avg_price"`                               // 均价 元/㎡
	MonthlyDeals int     `json:"monthly_deals"`                            // 月度成交套数
	OnSaleCount  int     `json:"on_sale_count"`                           // 在售套数
}

func (District) TableName() string { return "districts" }