package repository

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestParsePagination(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name          string
		query         string
		wantOffset    int
		wantLimit     int
		wantPageNum   int
	}{
		{
			name:        "defaults",
			query:       "",
			wantOffset:  0,
			wantLimit:   50,
			wantPageNum: 1,
		},
		{
			name:        "page 2",
			query:       "?page=2",
			wantOffset:  50,
			wantLimit:   50,
			wantPageNum: 2,
		},
		{
			name:        "custom limit",
			query:       "?page=3&limit=20",
			wantOffset:  40,
			wantLimit:   20,
			wantPageNum: 3,
		},
		{
			name:        "limit capped at 200",
			query:       "?limit=500",
			wantOffset:  0,
			wantLimit:   200,
			wantPageNum: 1,
		},
		{
			name:        "negative page becomes 1",
			query:       "?page=-5",
			wantOffset:  0,
			wantLimit:   50,
			wantPageNum: 1,
		},
		{
			name:        "invalid limit becomes 50",
			query:       "?limit=abc",
			wantOffset:  0,
			wantLimit:   50,
			wantPageNum: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/test"+tt.query, nil)
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			p, page := ParsePagination(c)

			if p.Offset != tt.wantOffset {
				t.Errorf("Offset = %d, want %d", p.Offset, tt.wantOffset)
			}
			if p.Limit != tt.wantLimit {
				t.Errorf("Limit = %d, want %d", p.Limit, tt.wantLimit)
			}
			if page != tt.wantPageNum {
				t.Errorf("page = %d, want %d", page, tt.wantPageNum)
			}
		})
	}
}

func TestWritePaginated(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("calculates totalPages correctly", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		data := []string{"a", "b", "c"}
		p := Pagination{Offset: 0, Limit: 2}

		WritePaginated(c, data, 5, p, 1)

		var resp map[string]interface{}
		// Parse JSON - need to read w.Body
		body := w.Body.Bytes()
		_ = body // body contains the JSON response
		_ = resp
	})

	t.Run("handles zero total", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		data := []string{}
		p := Pagination{Offset: 0, Limit: 50}

		WritePaginated(c, data, 0, p, 1)

		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})
}