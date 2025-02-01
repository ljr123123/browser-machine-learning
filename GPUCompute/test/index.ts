import {Flatten, Linear, ReLU, }



class SimpleNN extends nn.Module{
    flatten:Flatten;
    fc1:Linear;
    relu:ReLU;
    constructor() {
        super();
        self.flatten = nn.Flatten()  # 将输入展平为一维向量
        self.fc1 = nn.Linear(28 * 28, 128)  # 第一层全连接层
        self.relu = nn.ReLU()  # 激活函数
        self.fc2 = nn.Linear(128, 10)  # 输出层，10个类别
    }
}
        super(SimpleNN, self).__init__()
        self.flatten = nn.Flatten()  # 将输入展平为一维向量
        self.fc1 = nn.Linear(28 * 28, 128)  # 第一层全连接层
        self.relu = nn.ReLU()  # 激活函数
        self.fc2 = nn.Linear(128, 10)  # 输出层，10个类别

    def forward(self, x):
        x = self.flatten(x)  # 展平输入
        x = self.fc1(x)  # 第一层全连接
        x = self.relu(x)  # 激活
        x = self.fc2(x)  # 输出层
        return x

# 数据预处理
transform = transforms.Compose([
    transforms.ToTensor(),  # 将图片转换为Tensor
    transforms.Normalize((0.5,), (0.5,))  # 归一化
])

# 加载 MNIST 数据集
train_dataset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
test_dataset = datasets.MNIST(root='./data', train=False, download=True, transform=transform)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=1000, shuffle=False)

# 初始化模型、损失函数和优化器
model = SimpleNN()
criterion = nn.CrossEntropyLoss()  # 使用交叉熵损失函数
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)  # 使用随机梯度下降优化器

# 训练模型
def train(model, device, train_loader, optimizer, criterion, epochs=10):
    model.train()
    for epoch in range(epochs):
        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)
            optimizer.zero_grad()  # 清空梯度
            output = model(data)  # 前向传播
            loss = criterion(output, target)  # 计算损失
            loss.backward()  # 反向传播
            optimizer.step()  # 更新参数

            if batch_idx % 100 == 0:
                print(f"Train Epoch: {epoch} [{batch_idx * len(data)}/{len(train_loader.dataset)} ({100. * batch_idx / len(train_loader):.0f}%)]\tLoss: {loss.item():.6f}")

# 测试模型
def test(model, device, test_loader, criterion):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            test_loss += criterion(output, target).item()  # 累加损失
            pred = output.argmax(dim=1, keepdim=True)  # 获取预测结果
            correct += pred.eq(target.view_as(pred)).sum().item()  # 统计正确数量

    test_loss /= len(test_loader.dataset)
    print(f"Test set: Average loss: {test_loss:.4f}, Accuracy: {correct}/{len(test_loader.dataset)} ({100. * correct / len(test_loader.dataset):.0f}%)")

# 设置设备
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 训练和测试
train(model, device, train_loader, optimizer, criterion, epochs=5)
test(model, device, test_loader, criterion)