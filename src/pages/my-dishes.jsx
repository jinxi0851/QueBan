// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { Plus, Trash2, Clock, ChefHat, ArrowLeft } from 'lucide-react';

export default function MyDishes({
  $w
}) {
  const {
    toast
  } = useToast();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    difficulty: '中等',
    time: '20分钟',
    description: ''
  });
  useEffect(() => {
    loadUserDishes();
  }, []);
  const loadUserDishes = async () => {
    try {
      // 调用拿手菜管理云函数
      const result = await $w.cloud.callFunction({
        name: 'userDishesManagement',
        data: {
          action: 'getDishes'
        }
      });
      if (result.result.success) {
        setDishes(result.result.dishes);
      } else {
        throw new Error(result.result.error);
      }
    } catch (error) {
      console.error('加载拿手菜失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载您的拿手菜，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleAddDish = async () => {
    if (!newDish.name.trim()) {
      toast({
        title: '请输入菜名',
        description: '菜名不能为空',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      // 调用拿手菜管理云函数
      const result = await $w.cloud.callFunction({
        name: 'userDishesManagement',
        data: {
          action: 'addDish',
          dishData: newDish
        }
      });
      if (result.result.success) {
        toast({
          title: '添加成功',
          description: '您的拿手菜已添加！'
        });
        setNewDish({
          name: '',
          difficulty: '中等',
          time: '20分钟',
          description: ''
        });
        setShowAddForm(false);
        loadUserDishes();
      } else {
        throw new Error(result.result.error);
      }
    } catch (error) {
      console.error('添加拿手菜失败:', error);
      toast({
        title: '添加失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDish = async dishId => {
    if (!confirm('确定要删除这道拿手菜吗？')) {
      return;
    }
    try {
      // 调用拿手菜管理云函数
      const result = await $w.cloud.callFunction({
        name: 'userDishesManagement',
        data: {
          action: 'deleteDish',
          dishId: dishId
        }
      });
      if (result.result.success) {
        toast({
          title: '删除成功',
          description: '拿手菜已删除'
        });
        loadUserDishes();
      } else {
        throw new Error(result.result.error);
      }
    } catch (error) {
      console.error('删除拿手菜失败:', error);
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleBack = () => {
    $w.utils.navigateTo({
      pageId: 'profile'
    });
  };
  return <div className="min-h-screen from-[#FFF5F0] via-[#FFECD9] to-[#FF9A8B]/20 pb-24">
      {/* 顶部导航 */}
      <div className="pt-12 pb-6 px-6 animate-fadeIn">
        <div className="flex items-center mb-4">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mr-4 p-2 hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-[#2D3436] text-xl" style={{
          fontFamily: 'Noto Serif SC, serif'
        }}>
            我的拿手菜
          </h1>
        </div>
        <p className="text-[#636E72]">
          添加您的拿手菜，让菜单生成更个性化
        </p>
      </div>

      {/* 添加按钮 */}
      <div className="px-6 mb-6">
        <Button onClick={() => setShowAddForm(true)} className="w-full bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white rounded-full py-3">
          <Plus className="w-5 h-5 mr-2" />
          添加拿手菜
        </Button>
      </div>

      {/* 添加表单 */}
      {showAddForm && <div className="px-6 mb-6 animate-fadeIn">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#2D3436]">添加新菜品</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#636E72] mb-2">
                  菜名 *
                </label>
                <input type="text" value={newDish.name} onChange={e => setNewDish({
              ...newDish,
              name: e.target.value
            })} className="w-full px-3 py-2 border border-[#FFECD9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A8B]" placeholder="请输入菜名" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#636E72] mb-2">
                    难度
                  </label>
                  <select value={newDish.difficulty} onChange={e => setNewDish({
                ...newDish,
                difficulty: e.target.value
              })} className="w-full px-3 py-2 border border-[#FFECD9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A8B]">
                    <option value="简单">简单</option>
                    <option value="中等">中等</option>
                    <option value="困难">困难</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#636E72] mb-2">
                    用时
                  </label>
                  <select value={newDish.time} onChange={e => setNewDish({
                ...newDish,
                time: e.target.value
              })} className="w-full px-3 py-2 border border-[#FFECD9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A8B]">
                    <option value="10分钟">10分钟</option>
                    <option value="15分钟">15分钟</option>
                    <option value="20分钟">20分钟</option>
                    <option value="30分钟">30分钟</option>
                    <option value="45分钟">45分钟</option>
                    <option value="1小时">1小时</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#636E72] mb-2">
                  描述（可选）
                </label>
                <textarea value={newDish.description} onChange={e => setNewDish({
              ...newDish,
              description: e.target.value
            })} className="w-full px-3 py-2 border border-[#FFECD9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A8B]" rows={3} placeholder="简单描述这道菜的特色..." />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleAddDish} disabled={loading} className="flex-1 bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white">
                  {loading ? '添加中...' : '添加'}
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}

      {/* 拿手菜列表 */}
      <div className="px-6">
        {dishes.length === 0 ? <div className="text-center py-12">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-[#FF9A8B]" />
            <p className="text-[#636E72] mb-4">还没有添加拿手菜</p>
            <p className="text-[#636E72] text-sm">点击上方按钮添加您的拿手菜吧！</p>
          </div> : <div className="space-y-4">
            {dishes.map(dish => <Card key={dish._id} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-[#2D3436] text-lg">{dish.name}</h3>
                    <Button onClick={() => handleDeleteDish(dish._id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center text-[#636E72] text-sm">
                      <ChefHat className="w-4 h-4 mr-1" />
                      {dish.difficulty}
                    </div>
                    <div className="flex items-center text-[#636E72] text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {dish.time}
                    </div>
                  </div>
                  
                  {dish.description && <p className="text-[#636E72] text-sm">{dish.description}</p>}
                </CardContent>
              </Card>)}
          </div>}
      </div>
    </div>;
}